import { EpicDto } from './epic-dto';
import { MemberDto } from './member-dto';
import { UserStoryCheckListItemDto } from './user-story-checklistitem-dto';

export type UserStoryDto = {
  notionExport?: boolean;
  id: string;
  name: string;
  description: string;
  storyPoints?: number;
  completed?: boolean;
  orderIndex?: number;
  acceptanceCriteria?: string;
  dueDate?: string; // iso date string
  createdAt?: string; // iso date string
  updatedAt?: string; // iso date string
  epic?: EpicDto;
  checkListItems?: UserStoryCheckListItemDto[];
  assignees?: MemberDto[];
};
