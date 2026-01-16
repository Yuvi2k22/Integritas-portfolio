'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboardIcon } from 'lucide-react';

import { replaceRouteSlugs, routes } from '@workspace/routes';
import { Logo } from '@workspace/ui/components/logo';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@workspace/ui/components/sidebar';

import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';
import { AdvancedToolCategoryDto } from '~/types/dtos/advanced-tool-category-dto';
import { ProfileDto } from '~/types/dtos/profile-dto';
import { NavUser } from '../../../nav-user';
import { InitialSetupCollapsible } from './initial-setup-collapsible';
import { ProjectToolsList } from './project-tools-list';
import { EpicDto } from '~/types/dtos/epic-dto';
import { EpicSelector } from './epics-drop-down';

export type EpicSidebarProps = {
  profile: ProfileDto;
  advancedToolCategories: AdvancedToolCategoryDto[];
  allEpics: EpicDto[];
};

export function EpicSidebar(props: EpicSidebarProps): React.JSX.Element {
  const { profile, advancedToolCategories, allEpics } = props;
  const router = useRouter();

  const activeOrganization = useActiveOrganization();
  const activeProject = useActiveProject();

  const projectUrl = useMemo(() => {
    return replaceRouteSlugs(
      routes.dashboard.organizations.slug.projects.project.Index,
      { '[slug]': activeOrganization.slug, '[projectSlug]': activeProject.id },
    );
  }, [activeOrganization.slug, activeProject.id]);

  const handleEpicsBtnClick = () => router.push(projectUrl);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-wrap flex-row items-center py-0">
        <div className="px-1 py-2">
          <Logo />
        </div>
        <SidebarMenu>
          <SidebarMenuItem className="cursor-pointer mb-2">
            <SidebarMenuButton
              asChild
              tooltip="Back"
              onClick={handleEpicsBtnClick}
            >
              <span className="text-sm font-semibold">
                <LayoutDashboardIcon /> Library
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <EpicSelector
              allEpics={allEpics}
              profile={profile}
              activeProject={activeProject}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="m-6 mx-6" />
      <SidebarContent className="overflow-hidden">
        <ScrollArea verticalScrollBar className="h-full">
          <InitialSetupCollapsible />
          <ProjectToolsList advancedToolCategories={advancedToolCategories} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="h-14">
        <NavUser profile={profile} className="p-0" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
