// Import server-only module to ensure this code only runs on the server
import 'server-only';

// Import authentication and session handling utilities
import { getAuthOrganizationContext } from '@workspace/auth/context';
import { checkSession } from '@workspace/auth/session';
import { NotFoundError } from '@workspace/common/errors';

// Import data fetching functions for epics and projects
import { getEpic } from '~/data/epics/get-epic';
import { getProject } from '~/data/projects/get-project';

// Define an enum for validation error messages to ensure consistency and avoid hardcoded strings
export enum ValidationErrorMessages {
  InvalidAuth = 'Unauthenticated',
  ProjectNotFound = 'Project Not Found',
  EpicNotFound = 'Epic Not Found'
}

/**
 * Validates the authentication context by checking the session.
 *
 * @throws Error if the session is invalid.
 * @returns The authentication context if valid.
 */
export async function validateAuthContext() {
  const ctx = await getAuthOrganizationContext();
  const invalidAuth = !checkSession(ctx.session);

  if (invalidAuth) throw new Error(ValidationErrorMessages.InvalidAuth);

  return ctx;
}

/**
 * Validates the existence of both project and epic.
 *
 * @param projectId - The ID of the project to validate.
 * @param epicId - The ID of the epic to validate.
 * @throws Error if the project or epic is not found.
 * @returns An object containing the project and epic if both are valid.
 */
export async function validateProjectAndEpic(
  projectId: string,
  epicId: string
) {
  const [project, epic] = await Promise.all([
    getProject({ projectId }),
    getEpic({ projectId, epicId })
  ]);

  if (!project)
    throw new NotFoundError(ValidationErrorMessages.ProjectNotFound);
  if (!epic) throw new NotFoundError(ValidationErrorMessages.EpicNotFound);

  return { project, epic };
}
