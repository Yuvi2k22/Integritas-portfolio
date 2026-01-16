import { type EpicFeedbackType } from '@workspace/database';

export type EpicFeedbackDto = {
  id: string;
  type: EpicFeedbackType;
  advancedToolId: string | null;
  satisfied: boolean;
  reason: string | null;
};
