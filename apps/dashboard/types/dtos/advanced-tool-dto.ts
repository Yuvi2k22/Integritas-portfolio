import { AdvancedToolCategoryDto } from './advanced-tool-category-dto';

export type AdvancedToolDto = {
  id: string;
  name: string;
  description: string;
  slug: string;
  orderIndex: number;

  categoryId: string;
  category?: AdvancedToolCategoryDto;
};
