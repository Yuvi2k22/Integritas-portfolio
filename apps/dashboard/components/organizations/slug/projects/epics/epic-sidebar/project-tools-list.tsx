'use client';

import Link from 'next/link';
import {
  ClipboardListIcon,
  Code2Icon,
  DatabaseIcon,
  LayoutGridIcon,
  MessageSquareIcon,
  TestTubeIcon,
  ChevronRight,
} from 'lucide-react';

import { SidebarMenu, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { Badge } from '@workspace/ui/components/badge';
import { AdvancedToolCategoryDto } from '~/types/dtos/advanced-tool-category-dto';
import { useEpicSteps } from '../steps/use-epic-steps';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';

const categoryIconSlugMap: { [key: string]: React.ElementType } = {
  'user-stories': ClipboardListIcon,
  'test-cases': TestTubeIcon,
  'db-schema': DatabaseIcon,
  'front-end': Code2Icon,
  'api-docs': Code2Icon,
  chat: MessageSquareIcon,
};

type ProjectToolsListProps = {
  advancedToolCategories: AdvancedToolCategoryDto[];
};

export function ProjectToolsList(props: ProjectToolsListProps) {
  const { advancedToolCategories } = props;
  const { initialStepsCompleted, epicUrl } = useEpicSteps();

  const [productTeamOpen, setProductTeamOpen] = useState(false);
  const [developerToolsOpen, setDeveloperToolsOpen] = useState(false);

  if (!initialStepsCompleted) return <></>;
  const getToolUrl = (tool: { slug: string }, epicUrl: string) => {
    if (tool.slug === 'test-cases') {
      return `${epicUrl}/user-stories?testcases=true`;
    }
    return `${epicUrl}/${tool.slug}`;
  };
  return (
    <section id="sidebar-project-tools-list" className="relative mt-6">
      <SidebarMenu>
        {/* Product Team Tools */}
        <SidebarMenuItem>
          <Collapsible
            open={productTeamOpen}
            onOpenChange={setProductTeamOpen}
            className="w-full"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-2 text-sm font-medium">
              <span>Product Team Tools</span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  productTeamOpen ? 'rotate-90' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 animate-content-fade">
              {advancedToolCategories
                .find((c) => c.name === 'Product Team Tools')
                ?.tools?.map((tool) => {
                  const CategoryToolIcon =
                    categoryIconSlugMap[tool.slug] || LayoutGridIcon;
                  const isTestCases = tool.slug === 'test-cases';

                  if (isTestCases) {
                    return (
                      <div
                        key={tool.id}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium opacity-60 cursor-not-allowed w-[90%]"
                      >
                        <CategoryToolIcon className="w-5 h-5" />
                        <span>{tool.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Upcoming
                        </Badge>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={tool.id}
                      href={getToolUrl(tool, epicUrl)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent relative group  w-[90%] hover:rounded-lg"
                    >
                      <CategoryToolIcon className="w-5 h-5" />
                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>

        {/* Developer Tools */}
        <SidebarMenuItem>
          <Collapsible
            open={developerToolsOpen}
            onOpenChange={setDeveloperToolsOpen}
            className="w-full"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-2 text-sm font-medium">
              <span>Developer Tools</span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  developerToolsOpen ? 'rotate-90' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 animate-content-fade">
              {advancedToolCategories
                .find((c) => c.name === 'Developer Tools')
                ?.tools?.map((tool) => {
                  const CategoryToolIcon =
                    categoryIconSlugMap[tool.slug] || LayoutGridIcon;
                  const isFrontend = tool.slug === 'front-end';

                  if (isFrontend) {
                    return (
                      <div
                        key={tool.id}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium opacity-60 cursor-not-allowed w-[90%]"
                      >
                        <CategoryToolIcon className="w-5 h-5" />
                        <span>{tool.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Upcoming
                        </Badge>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={tool.id}
                      href={`${epicUrl}/${tool.slug}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent relative group w-[90%] hover:rounded-lg"
                    >
                      <CategoryToolIcon className="w-5 h-5" />
                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>

        {/* Chat - Standalone Item */}
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-6 py-3 text-sm font-medium opacity-60 cursor-not-allowed w-[100%]">
            <MessageSquareIcon className="w-5 h-5" />
            <span>Chat</span>
            <Badge variant="secondary" className="ml-24 text-xs">
              Upcoming
            </Badge>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </section>
  );
}
