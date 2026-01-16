import { getAnthropicClient } from '@workspace/ai/anthropic';
import { prisma } from '@workspace/database/client';

import { EpicDto } from '~/types/dtos/epic-dto';
import { StreamControllerState } from '../../types';

/**
 * Generates the prompt for the advanced tool after replacing the placeholders
 */
async function getProcessedPrompt(epic: EpicDto, advancedToolId: string) {
  const advancedTool = await prisma.advancedTool.findFirst({
    where: { id: advancedToolId },
    select: { prompt: true },
  });
  if (!advancedTool) return '';

  const designFiles = await prisma.designFile.findMany({
    where: { epicId: epic.id },
    select: { designFlowDoc: true },
    orderBy: { orderIndex: 'asc' },
  });

  const screenDocs = designFiles
    .map((designFile) => designFile.designFlowDoc)
    .join('\n\n');

  const processedPrompt = advancedTool.prompt
    .replaceAll('{{epicName}}', epic.name)
    .replaceAll('{{epicDescription}}', epic.description)
    .replaceAll('{{app-flow}}', epic.epicFlowDoc)
    .replaceAll('{{screen-docs}}', screenDocs);

  return processedPrompt;
}

/**
 * Create or Update the existing entry in db with new content
 * (Updates for regenerate)
 */
async function createOrUpdateContent(
  epicId: string,
  toolId: string,
  content: string,
) {
  const existingContent = await prisma.advancedToolGeneratedContent.findFirst({
    where: { toolId, epicId },
  });
  if (!existingContent) {
    return await prisma.advancedToolGeneratedContent.create({
      data: { epicId, toolId, content, reGenerateCount: 0 },
    });
  } else {
    return await prisma.advancedToolGeneratedContent.update({
      where: { toolId, epicId, id: existingContent.id },
      data: {
        content,
        reGenerateCount: existingContent.content
          ? existingContent?.reGenerateCount
            ? existingContent?.reGenerateCount + 1
            : 1
          : 0,
      },
    });
  }
}

/**
 * Generates content for advanced tool of a given epic using AI, and streams the result if a controller is provided.
 */
export async function generateAdvancedToolContent(
  epic: EpicDto,
  advancedToolId: string,
  controller: ReadableStreamDefaultController,
  controllerState: StreamControllerState,
) {
  const prompt = await getProcessedPrompt(epic, advancedToolId);

  if (!prompt) return '';

  let toolContent: string = '';

  const client = getAnthropicClient();
  const response = await client.beta.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 128000,
    temperature: 1,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    betas: ['output-128k-2025-02-19'],
    stream: true,
  });
  const responseStream = response.toReadableStream();
  const responseStreamReader = responseStream.getReader();

  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await responseStreamReader.read();

    if (done) break;

    const stringifiedJSON = decoder.decode(value, { stream: true });

    try {
      const { type, delta } = JSON.parse(stringifiedJSON);

      if (type === 'content_block_delta' || type === 'content_block_start') {
        const content = delta.text;

        toolContent += content;

        if (!controllerState.controllerClosed) controller.enqueue(content);
      }
    } catch (error) {
      console.log(error);
    }
  }

  await createOrUpdateContent(epic.id, advancedToolId, toolContent);

  return toolContent;
}
