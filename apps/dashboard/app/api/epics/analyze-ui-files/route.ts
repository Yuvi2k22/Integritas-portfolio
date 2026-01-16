import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { NotFoundError } from '@workspace/common/errors';

import { parseJSONRequest } from '~/lib/utils/api/parsers';
import {
  BadRequestResponse,
  ConflictResponse,
  NotFoundResponse,
  StreamedTextResponse,
  UnauthorizedResponse
} from '~/lib/utils/api/responses';
import {
  validateAuthContext,
  validateProjectAndEpic,
  ValidationErrorMessages
} from '~/lib/utils/api/validations';
import {
  AnalyzeUIFilesSchema,
  analyzeUIFilesSchema
} from '~/schemas/epics/analyze-ui-files-schema';
import { StreamControllerState } from '../../types';
import { analyzeDesignFiles } from './helper';

export async function POST(req: NextRequest) {
  try {
    await validateAuthContext();
    const { projectId, epicId } = await parseJSONRequest<AnalyzeUIFilesSchema>(
      req,
      analyzeUIFilesSchema
    );
    const { epic } = await validateProjectAndEpic(projectId, epicId);

    if (epic.status !== 'UPLOAD_COMPLETED')
      return ConflictResponse({ message: 'Already Analyzed' });

    const streamControllerState: StreamControllerState = {
      controllerClosed: false
    };

    const stream = new ReadableStream({
      async start(controller) {
        await analyzeDesignFiles(epic, controller, streamControllerState);
        controller.close();
      },
      async cancel() {
        streamControllerState.controllerClosed = true;
      }
    });

    return StreamedTextResponse(stream);
  } catch (e) {
    const error = e as Error;

    if (error.message === ValidationErrorMessages.InvalidAuth)
      return UnauthorizedResponse(error.message);

    if (error instanceof ZodError) return BadRequestResponse(error.errors);
    if (error instanceof NotFoundError) return NotFoundResponse(error.message);
  }
}
