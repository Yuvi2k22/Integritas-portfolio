'use server';

import { getAnthropicClient } from '@workspace/ai/anthropic';
import { EpicPrompts } from '@workspace/ai/prompts';
import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { generateStoryDetailsSchema } from '~/schemas/user-stories/generate-story-details-schema';
import { EpicDto } from '~/types/dtos/epic-dto';
import { authOrganizationActionClient } from '../safe-action';

async function getProcessedPrompt(epic: EpicDto) {
  const designFiles = await prisma.designFile.findMany({
    where: { epicId: epic.id }
  });
  const userStories = await prisma.userStory.findMany({
    where: { epicId: epic.id, acceptanceCriteria: '' }
  });

  const prompt =
    EpicPrompts.UserStoryAcceptanceCriteria.getUserStoryAcceptanceCriteriaPrompt(
      epic.epicFlowDoc,
      designFiles.map((designFile) => designFile.designFlowDoc),
      userStories
    );

  return prompt;
}

type AcceptanceCriteria = {
  story_id: string;
  user_story: string;
  scenarios: Array<{
    title: string;
    given: string;
    when: string;
    then: string;
  }>;
  conditions_of_satisfaction: string[];
};

async function generateAcceptanceCriteria(
  prompt: string
): Promise<AcceptanceCriteria[]> {
  const client = getAnthropicClient();

  const response = await client.beta.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 128000,
    temperature: 1,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    betas: ['output-128k-2025-02-19']
  });

  const content = response.content[0];

  try {
    if (content.type === 'text')
      return JSON.parse(content.text).acceptance_criteria;
  } catch (err) {
    console.log(err);
    return [];
  }

  return [];
}

async function updateStoriesWithCriteriaAndChecklist(
  criterias: AcceptanceCriteria[]
) {
  for (let index = 0; index < criterias.length; index++) {
    const currentCriteria = criterias[index];
    const acceptanceCriteria = currentCriteria.scenarios
      .map(
        (scenario) => `#### ${scenario.title}
- Given: ${scenario.given}
- When: ${scenario.when}
- Then: ${scenario.then}
      `
      )
      .join('\n\n');
    await prisma.userStory.update({
      where: { id: currentCriteria.story_id },
      data: {
        acceptanceCriteria,
        checkListItems: {
          createMany: {
            data: currentCriteria.conditions_of_satisfaction.map(
              (condition, index) => ({ name: condition, orderIndex: index })
            )
          }
        }
      }
    });
  }
}

export const generateStoryDetails = authOrganizationActionClient
  .metadata({ actionName: 'generateStoryDetails' })
  .schema(generateStoryDetailsSchema)
  .action(async ({ parsedInput }) => {
    const { epic } = await validateProjectAndEpic(
      parsedInput.projectId,
      parsedInput.epicId
    );

    const prompt = await getProcessedPrompt(epic);
    const criterias = await generateAcceptanceCriteria(prompt);
    await updateStoriesWithCriteriaAndChecklist(criterias);
  });
