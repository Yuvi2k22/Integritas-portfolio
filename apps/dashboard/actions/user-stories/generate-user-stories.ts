'use server';

import { getAnthropicClient } from '@workspace/ai/anthropic';
import { EpicPrompts } from '@workspace/ai/prompts';
import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { generateUserStoriesSchema } from '~/schemas/user-stories/generate-user-stories-schema';
import { authOrganizationActionClient } from '../safe-action';

export async function generateUserStoriesWithAI(prompt: string) {
  const client = getAnthropicClient();

  const response = await client.beta.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 128000,
    temperature: 1,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    betas: ['output-128k-2025-02-19']
  });

  const content = response.content[0];
  if (content.type === 'text') return JSON.parse(content.text);
  return [];
}

export const generateUserStories = authOrganizationActionClient
  .metadata({
    actionName: 'generateUserStories'
  })
  .schema(generateUserStoriesSchema)
  .action(async ({ parsedInput }) => {
    const { epic } = await validateProjectAndEpic(
      parsedInput.projectId,
      parsedInput.epicId
    );

    const userStoriesGenerationPrompt =
      EpicPrompts.UserStories.getUserStoriesGenerationPrompt(
        epic.epicFlowDoc,
        epic.designFiles?.map((designFile) => designFile.designFlowDoc)
      );

    const userStories = await generateUserStoriesWithAI(
      userStoriesGenerationPrompt
    );
    // Loop over created stories create it as single transaction along with related data to foreign tables
    await prisma.$transaction(
      userStories.map((story: any, index: number) => {
        return prisma.userStory.create({
          data: {
            epicId: epic.id,
            name: story.title,
            description: story.description,
            acceptanceCriteria: story.acceptanceCriteria,
            checkListItems: { createMany: { data: [] } },
            orderIndex: index
          }
        });
      })
    );
  });
