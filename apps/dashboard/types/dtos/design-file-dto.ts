export type DesignFileDto = {
  id: string;
  filename: string;
  description: string;
  designFlowDoc: string;
  orderIndex: number;
  accessUrl: string;

  epicId: string;
  parentFileId?: string | null;

  subFiles?: DesignFileDto[];
  backendLogicTranscription?: string | null;
};
