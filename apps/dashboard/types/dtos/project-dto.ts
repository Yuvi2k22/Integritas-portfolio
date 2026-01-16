import { EpicDto } from './epic-dto';

export type ProjectDto = {
  id: string;
  name: string;
  description: string;

  epics?: EpicDto[];

  createdAt: string; // ISO Date
  updatedAt: string; // ISO date

  organizationId: string; // Id of the organization to which the project belongs
};
