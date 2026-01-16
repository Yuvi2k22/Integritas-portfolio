import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { NotFoundError } from '@workspace/common/errors';

import { parseJSONRequest } from '~/lib/utils/api/parsers';
import {
  BadRequestResponse,
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
  GenerateAppFlowSchema,
  generateAppFlowSchema
} from '~/schemas/epics/generate-app-flow-schema';
import { StreamControllerState } from '../../types';
import { generateScreenDocs } from './helper';

export async function POST(req: NextRequest) {
  try {
    // Step 1: Validate the authentication context to ensure the user is authorized.
    await validateAuthContext();

    // Step 2: Parse and validate the request body using Zod schema.
    // Ensures the body contains valid projectId and epicId.
    const { projectId, epicId } = await parseJSONRequest<GenerateAppFlowSchema>(
      req,
      generateAppFlowSchema
    );

    // Step 3: Validate that the project and epic exist and are accessible.
    const { epic } = await validateProjectAndEpic(projectId, epicId);

    // Step 4: Set up the controller state to track the stream's status.
    const streamControllerState: StreamControllerState = {
      controllerClosed: false
    };

    // Step 5: Create a new ReadableStream to handle streaming content back to the client.
    const stream = new ReadableStream({
      async start(controller) {
        // Begin generating the screen docs and stream the output in real-time.
        await generateScreenDocs(epic, controller, streamControllerState);

        // Close the stream once generation is complete.
        controller.close();
        streamControllerState.controllerClosed = true;
      },
      async cancel() {
        // If the client cancels the stream, mark it as closed to stop further processing.
        streamControllerState.controllerClosed = true;
      }
    });

    // Step 6: Return the streamed response to the client.
    return StreamedTextResponse(stream);
  } catch (e) {
    const error = e as Error;

    // Handle various error cases and return appropriate HTTP responses.

    // Unauthorized: Occurs if auth validation fails.
    if (error.message === ValidationErrorMessages.InvalidAuth)
      return UnauthorizedResponse(error.message);

    // Bad Request: Occurs if request validation fails (e.g., missing/invalid fields).
    if (error instanceof ZodError) return BadRequestResponse(error.errors);

    // Not Found: Occurs if the project or epic doesn't exist.
    if (error instanceof NotFoundError) return NotFoundResponse(error.message);
  }
}
