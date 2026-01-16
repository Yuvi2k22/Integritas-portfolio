import { geminiCompletion } from '@workspace/ai/gemini';
import { EpicPrompts } from '@workspace/ai/prompts';
import { DesignFile, EpicStatus, PrismaPromise } from '@workspace/database';
import { prisma } from '@workspace/database/client';

import { EpicDto } from '~/types/dtos/epic-dto';
import { StreamControllerState } from '../../types';

/**
 * Orchestrates the process of analyzing design files to generate a unified app flow,
 * orders the screens accordingly, and updates the design files in the database.
 *
 * @param designFiles - Array of design files to analyze
 * @param controller - Stream controller for streaming updates during the process
 * @param controllerState - State object to track if the stream has been closed
 */
export async function analyzeDesignFiles(
  epic: EpicDto,
  controller: ReadableStreamDefaultController,
  controllerState: StreamControllerState
) {
  // fetch design files of epic
  const designFiles = await getDesignFilesOfEpic(epic.id);
  // Split design files into two batches and get their URLs
  const { updatedDesignFiles } = getUrlsInBatches(designFiles);

  const appFlow = await generateReferenceAppFlow(
    epic,
    updatedDesignFiles,
    controller,
    controllerState
  );

  // Generate an ordered list of screens based on the unified app flow
  const orderedScreens = await generateOrderedScreens(
    epic,
    appFlow,
    updatedDesignFiles
  );

  // Update design files in the database with new order and hierarchy
  await rearrangeDesignFilesInDB(designFiles, orderedScreens);

  // update epic status as AI analysis completed
  await updateAIAnalysisCompleted(epic.id);
}

/**
 * Fetches all design files associated with a given epic, ordered by creation date in ascending order.
 *
 * @param epicId - The ID of the epic to retrieve design files for.
 * @returns  A promise that resolves to an array of design files.
 */
export async function getDesignFilesOfEpic(epicId: string) {
  // Query the database to find all design files related to the specified epicId
  const designFiles = await prisma.designFile.findMany({
    where: { epicId }, // Filter by the provided epicId
    orderBy: { orderIndex: 'asc' } // Sort results by creation date in ascending order
  });

  // Return the list of design files
  return designFiles;
}

/**
 * Splits the design files into two batches and returns their URLs for processing.
 *
 * @param designFiles - Array of design files to be processed
 * @returns An object containing two batches of URLs for design files
 */
export function getUrlsInBatches(designFiles: DesignFile[]) {
  // Extract the first 10 files for batch1
  const updatedDesignFiles = designFiles.map(
    ({ s3ObjectKey }) =>
      `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/${s3ObjectKey}`
  );

  return { updatedDesignFiles };
}

/**
 * Generates a reference app flow for a given batch of design file URLs.
 *
 * @param epic - epic for which reference appflow is to be generated
 * @param imageUrls - Array of image URLs for the batch
 * @param controller - Stream controller to send updates while processing
 * @param controllerState - State object to track if the stream has been closed
 * @returns A string representing the app flow generated for the batch
 */
export async function generateReferenceAppFlow(
  epic: EpicDto,
  imageUrls: string[],
  controller: ReadableStreamDefaultController,
  controllerState: StreamControllerState
) {
  // Return an empty string if no URLs are provided
  if (imageUrls.length === 0) return '';

  // Fetch the prompt to generate app flow
  const prompt = EpicPrompts.Step2.getRefercenceAppFlowPrompt(
    epic.name,
    epic.description,
    epic.epicSpeciality
  );
  const flow = await geminiCompletion(prompt, imageUrls, {
    stream: true,
    controllerState: {
      controllerClosed: controllerState.controllerClosed,
      enqueue: (chunk: string) => controller.enqueue(chunk)
    }
  });

  return flow;
}

// Type definition for ordered screen data structure
export type OrderedScreen = {
  original_order: number;
  screen_id: number;
  screen_title: string;
  screen_type: 'main' | 'sub';
  image_description: string;
  sub_screens?: Array<{
    original_order: number;
    screen_title: string;
    image_description: string;
  }>;
};

/**
 * Generates an ordered list of screens based on the unified app flow.
 *
 * @param epic - epic for which ordered screens are to be generated
 * @param appFlow - Unified app flow from previous steps
 * @returns An array of ordered screens representing the new screen hierarchy
 */
export async function generateOrderedScreens(
  epic: EpicDto,
  appFlow: string,
  image_urls: string[]
): Promise<OrderedScreen[]> {
  // Fetch the prompt for unifying app flows
  const prompt = EpicPrompts.Step2.getScreenNamingAndOrderingPrompt(
    epic.name,
    epic.description,
    epic.epicSpeciality,
    appFlow
  );
  // Call geminiCompletion with the prompt and no images, in non-streaming mode
  const stringifiedJSON = await geminiCompletion(prompt, image_urls, {
    stream: false
  });

  // Parse the ordered screens from the JSON response
  const orderedScreens = JSON.parse(stringifiedJSON) as OrderedScreen[];

  return orderedScreens;
}

/**
 * Updates design files in the database based on the ordered screens generated from the app flow.
 *
 * @param designFiles - Array of design files to be updated
 * @param orderedScreens - Ordered list of screens representing the new screen order and hierarchy
 */
export async function rearrangeDesignFilesInDB(
  designFiles: DesignFile[],
  orderedScreens: OrderedScreen[]
) {
  const promises: PrismaPromise<unknown>[] = [];

  orderedScreens.forEach((orderedScreen, index) => {
    const targetDesignFile = designFiles[orderedScreen.original_order - 1];
    const newOrderIndex = index + 1;

    promises.push(
      prisma.designFile.update({
        where: { id: targetDesignFile.id },
        data: {
          filename: orderedScreen.screen_title,
          description: orderedScreen.image_description,
          parentFileId: null,
          orderIndex: newOrderIndex
        }
      })
    );

    orderedScreen.sub_screens?.forEach((subScreen, subIndex) => {
      const targetDesignSubFile = designFiles[subScreen.original_order - 1];
      const newSubFileOrderIndex = newOrderIndex + subIndex + 1;

      promises.push(
        prisma.designFile.update({
          where: { id: targetDesignSubFile.id },
          data: {
            filename: subScreen.screen_title,
            description: subScreen.image_description,
            parentFileId: targetDesignFile.id,
            orderIndex: newSubFileOrderIndex
          }
        })
      );
    });
  });

  return await prisma.$transaction(promises);
}

/**
 * Updates the status of an epic to "AI_ANALYSIS_COMPLETED".
 *
 * @param epicId - The ID of the epic to update.
 * @returns  A promise that resolves to the updated epic object.
 */
export async function updateAIAnalysisCompleted(epicId: string) {
  // Update the epic with the given ID, setting its status to AI_ANALYSIS_COMPLETED
  const updatedEpic = await prisma.epic.update({
    where: { id: epicId }, // Identify the epic by its ID
    data: { status: EpicStatus.AI_ANALYSIS_COMPLETED } // Update the status field
  });

  // Return the updated epic object
  return updatedEpic;
}
