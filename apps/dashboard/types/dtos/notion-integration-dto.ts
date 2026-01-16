import { NotionProjectDB } from "./notion-integration-projectDB-dto";

export type NotionIntegration = {
  data: any;
  id: string;
  auth_token: string | null;
  projectId: string;
  notionProjectDB?: NotionProjectDB[];
};
