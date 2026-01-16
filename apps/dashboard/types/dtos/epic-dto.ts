import { type EpicStatus } from '@workspace/database';

import { DesignFileDto } from './design-file-dto';
import { EpicFeedbackDto } from './epic-feedback-dto';

export type EpicDto = {
  backendLogicAudioRecordedTime: string | null | undefined;
  id: string;
  name: string;
  description: string;
  epicFlowDoc: string;
  status: EpicStatus;
  epicSpeciality: string;
  thirdpartyRequirements: string;

  createdAt: string;
  updatedAt: string;

  projectId: string;

  designFiles?: DesignFileDto[];
  userStories?: any[];

  reGenerateCount?: number | null;
  epicFeedbacks?: EpicFeedbackDto[];

  backendLogicGeneralTranscription?: string | null;

  backendLogicAudioTranscription?: string | null;

  backendLogicAudioS3ObjectKey?: string | null;
};
