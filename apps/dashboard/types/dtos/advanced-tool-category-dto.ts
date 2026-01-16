import { AdvancedToolDto } from './advanced-tool-dto';

export type AdvancedToolCategoryDto = {
  id: string;
  name: string;
  description: string;
  slug: string;
  orderIndex: number;

  tools?: AdvancedToolDto[];
};
