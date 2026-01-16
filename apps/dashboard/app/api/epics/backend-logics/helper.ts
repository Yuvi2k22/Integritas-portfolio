import { getElevenLabsClient } from '@workspace/ai/elevenlabs';
import {
  getDesignFilesOfEpic,
  getUrlsInBatches,
} from '../analyze-ui-files/helper';
import { EpicPrompts } from '@workspace/ai/prompts';
import { geminiCompletion } from '@workspace/ai/gemini';
import { PrismaPromise } from '@workspace/database';
import { prisma } from '@workspace/database/client';
import {
  deleteFiles,
  getKeyFromTemplate,
  S3_Key_Templates,
  TemplateFields,
  uploadFiles,
} from '@workspace/aws/s3';

export type TranscriptionItem = {
  imageUrl: string;
  explanation: string;
  keypoints: string;
};
export async function extractTranscription(
  audio: File,
): Promise<string | null> {
  const buffer = Buffer.from(await audio.arrayBuffer());
  const audioBlob = new Blob([buffer], { type: 'audio/webm' });
  const client = getElevenLabsClient();

  const result = await client.speechToText.convert({
    file: audioBlob,
    modelId: 'scribe_v1',
  });

  return result.text;
}

export async function extractTranscriptionFromUrl(
  audioUrl: string,
  langCode: string,
): Promise<string | null> {
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([arrayBuffer], { type: 'audio/webm' });
    const client = getElevenLabsClient();

    const result = await client.speechToText.convert({
      file: audioBlob,
      modelId: 'scribe_v1',
      languageCode: langCode,
      tagAudioEvents: false,
    });
    return result.text ? result.text : '';
  } catch (error) {
    console.log('ELevenLabsError', error);
    return '';
  }
}

export async function distributeTranscription(
  epicId: string,
  transcript: string,
) {
  const designFiles = await getDesignFilesOfEpic(epicId);
  const { updatedDesignFiles } = getUrlsInBatches(designFiles);

  const prompt = EpicPrompts.Step2_1.distributeTranscriptionByDesignFiles({
    transcript,
    imageUrls: updatedDesignFiles,
  });

  const stringified = await geminiCompletion(prompt, updatedDesignFiles, {
    stream: false,
  });
  if (stringified?.includes('An error occurred while generating')) {
    return {
      screens: [],
      general: null,
    };
  }
  return JSON.parse(stringified);
}

function cleanImageUrl(url: string): string {
  return url
    .replace(
      `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/`,
      '',
    )
    .trim();
}

export async function updateDesignFilesWithTranscriptions(
  items: TranscriptionItem[],
) {
  const tasks: PrismaPromise<unknown>[] = [];

  const validItems = items
    .filter((d) => d.keypoints)
    .map((d) => ({
      ...d,
      imageUrl: cleanImageUrl(d.imageUrl),
    }));
  if (validItems.length > 0) {
    for (const data of validItems) {
      const { imageUrl, keypoints } = data;

      const designFile = await prisma.designFile.findFirst({
        where: { s3ObjectKey: imageUrl },
        select: { id: true },
      });

      if (designFile) {
        tasks.push(
          prisma.designFile.update({
            where: { id: designFile.id },
            data: {
              backendLogicTranscription: keypoints,
            },
          }),
        );
      }
    }
  }
  if (tasks.length) {
    await prisma.$transaction(tasks);
  }
}

export function respond(status: number, data: object): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function audioUploadToS3(
  organizationId: string,
  projectId: string,
  epicId: string,
  audio: File,
) {
  const filesWithKeys: { file: File; key: string }[] = [];
  const targetKeyTemplate = S3_Key_Templates.epicAudioFile;
  const key = getKeyFromTemplate(targetKeyTemplate, {
    [TemplateFields.OrganizationId]: organizationId,
    [TemplateFields.ProjectId]: projectId,
    [TemplateFields.EpicId]: epicId,
    [TemplateFields.FileId]: 'backendLogic',
  });
  await deleteFiles([key]);
  filesWithKeys.push({ key, file: audio });
  const data = await Promise.all([
    uploadFiles(filesWithKeys, true),
    prisma.epic.update({
      where: { id: epicId },
      data: { backendLogicAudioS3ObjectKey: key },
    }),
  ]);
  return data[1].backendLogicAudioS3ObjectKey;
}
