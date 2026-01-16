export type UserStoryCheckListItemDto = {
  id: string;
  name: string;
  orderIndex: number;
  completed: boolean;

  createdAt?: string; // iso date string
  updatedAt?: string; // iso date string
};
