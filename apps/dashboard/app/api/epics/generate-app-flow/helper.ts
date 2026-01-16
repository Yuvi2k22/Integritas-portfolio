import { geminiCompletion } from '@workspace/ai/gemini';
import { EpicPrompts } from '@workspace/ai/prompts';
import { EpicStatus, Prisma } from '@workspace/database';
import { prisma } from '@workspace/database/client';

import { EpicDto } from '~/types/dtos/epic-dto';
import { generateEpicSummary } from '../../../../../../packages/ai/src/prompts/epic/common';
import { StreamControllerState } from '../../types';
/**
 * Fetches signed public URLs for all design files associated with a given epic ID.
 * These URLs can be used to access the files directly.
 *
 * @param epicId - The ID of the epic to get design files for.
 * @returns A list of signed URLs for the design files.
 */
export async function getEpicDesignFileUrls(epicId: string) {
  // Retrieve design files linked to the given epic, sorted by orderIndex
  const designFiles = await prisma.designFile.findMany({
    where: { epicId },
    select: { s3ObjectKey: true, description: true, filename: true },
    orderBy: { orderIndex: 'asc' },
  });
  let descriptions = '';
  // Generate signed public access URLs for each design file
  const signedUrls = designFiles.map(
    ({ s3ObjectKey, description, filename }, index) => {
      descriptions += `${index + 1}. ${filename}` + '\n' + description + '\n';
      return `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/${s3ObjectKey}`;
    },
  );
  // Return the signed URLs
  return { imageUrls: signedUrls, image_descriptions: descriptions };
}

/**
 * Updates the epic with a new app flow document content.
 *
 * @param epicId - The ID of the epic to update.
 * @param epicFlow - The new app flow document as a string.
 * @param updateStatus flag if true epic's status will be updated to APP_FLOW_GENERATED
 * @returns The updated epic.
 */
export async function updateEpicFlow(
  epicId: string,
  epicFlow: string,
  updateStatus: boolean,
) {
  const existingEpic = await prisma.epic.findUnique({
    where: { id: epicId },
    select: { reGenerateCount: true, epicFlowDoc: true },
  });

  const data: Prisma.EpicUpdateInput = {
    epicFlowDoc: epicFlow,
  };

  if (existingEpic?.epicFlowDoc) {
    data.reGenerateCount = existingEpic?.reGenerateCount ? { increment: 1 } : 1;
  }

  if (updateStatus) {
    data.status = EpicStatus.APP_FLOW_GENERATED;
  }

  return prisma.epic.update({
    where: { id: epicId },
    data,
  });
}

/**
 * Generates an app flow for a given epic using AI, and streams the result if a controller is provided.
 *
 * @param epic - The epic for which flow is to be generated.
 * @param controller - A readable stream controller for streaming the content.
 * @param controllerState - The state of the stream controller to check if it's still open.
 * @returns The full app flow as a string.
 */
export async function generateAppFlowForEpic(
  epic: EpicDto,
  controller: ReadableStreamDefaultController,
  controllerState: StreamControllerState,
) {
  // Fetch the signed URLs of the epic's design files
  const { imageUrls, image_descriptions } = await getEpicDesignFileUrls(
    epic.id,
  );

  // Return an empty string if no design files are present
  if (imageUrls.length === 0) return '';
  const product_details = generateEpicSummary(
    epic.name,
    epic.description,
    epic.epicSpeciality,
  );
  let transcriptionText = '';
  if (epic.backendLogicGeneralTranscription) {
    transcriptionText += epic.backendLogicGeneralTranscription;
  }

  const backendLogicTranscriptions = await prisma.designFile.findMany({
    where: { epicId: epic.id },
    select: { backendLogicTranscription: true },
  });
  if (backendLogicTranscriptions.length) {
    backendLogicTranscriptions.forEach(
      (transcription: { backendLogicTranscription: string | null }) => {
        if (transcription) {
          transcriptionText += `\n${transcription.backendLogicTranscription}`;
        }
      },
    );
  }
  // Generate the prompt for the app flow based on the epic name and description
  const prompt = EpicPrompts.Step3.getAppflowPrompt(
    image_descriptions,
    product_details,
    transcriptionText,
  );
  // Initialize an empty string to hold the app flow
  const flow = await geminiCompletion(prompt, [], {
    stream: true,
    controllerState: {
      controllerClosed: controllerState.controllerClosed,
      enqueue: (chunk: string) => controller.enqueue(chunk),
    },
  });

  // Return the full app flow after processing all chunks
  return flow;
}
