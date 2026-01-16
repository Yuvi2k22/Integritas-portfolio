'use server';

import { getProjects } from '~/data/projects/get-projects';
import { getProjectsSchema } from '~/schemas/projects/get-projects-schema';
import { authOrganizationActionClient } from '../safe-action';

export const fetchProjectsProxy = authOrganizationActionClient
  .metadata({ actionName: 'fetchProjectsProxy' })
  .schema(getProjectsSchema)
  .action(async ({ parsedInput }) => {
    const { projects } = await getProjects(parsedInput);
    return projects;
  });
