'use server';

import { prisma } from '@workspace/database/client';

import { addFeedbackSchema } from '~/schemas/epics/add-feedback-schema';
import { authOrganizationActionClient } from '../safe-action';

export const addFeedback = authOrganizationActionClient
  .metadata({ actionName: 'addFeedback' })
  .schema(addFeedbackSchema)
  .action(async ({ parsedInput }) => {
    return await prisma.epicFeedback.create({
      data: {
        epicId: parsedInput.epicId,
        type: parsedInput.feedbackType,
        advancedToolId: parsedInput.advancedToolId,
        satisfied: parsedInput.satisfied,
        reason: parsedInput.reason
      }
    });
  });
