import { AdvancedToolDto } from './advanced-tool-dto';
import { EpicDto } from './epic-dto';

export type AdvancedToolGeneratedContentDto = {
  id: string;
  content: string;

  epicId: string;
  epic?: EpicDto;

  toolId: string;
  tool?: AdvancedToolDto;

  reGenerateCount?: number | null;
};
