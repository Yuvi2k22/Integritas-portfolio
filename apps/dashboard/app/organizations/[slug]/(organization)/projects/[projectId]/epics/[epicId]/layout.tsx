import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { SidebarInset } from '@workspace/ui/components/sidebar';

import { EpicSidebar } from '~/components/organizations/slug/projects/epics/epic-sidebar';
import { getProfile } from '~/data/account/get-profile';
import { getAdvancedToolCategories } from '~/data/advanced-tools/get-advanced-tool-categories';
import { getEpic } from '~/data/epics/get-epic';
import { getMembers } from '~/data/members/get-members';
import { getProject } from '~/data/projects/get-project';
import { ActiveEpicProvider } from '~/hooks/use-active-epic';
import { ActiveOrganizationMembersProvider } from '~/hooks/use-active-organization-members';
import { ActiveProjectProvider } from '~/hooks/use-active-project';
import { createTitle } from '~/lib/formatters';
import { ActiveNotionProvider } from '~/hooks/use-active-notion';
import { getNotion } from '~/actions/notion/get-notion';
import { getAllEpics } from '~/data/epics/get-all-epics';

export const metadata: Metadata = {
  title: createTitle('Project'),
};

const paramsCache = createSearchParamsCache({
  projectId: parseAsString.withDefault(''),
  epicId: parseAsString.withDefault(''),
});

export default async function EpicLayout(
  props: NextPageProps & React.PropsWithChildren,
): Promise<React.JSX.Element> {
  const { projectId, epicId } = await paramsCache.parse(props.params);

  const [project, epic, advancedToolCategories, notionResult, allEpics] =
    await Promise.all([
      getProject({ projectId }),
      getEpic({ projectId, epicId }),
      getAdvancedToolCategories(),
      getNotion({ projectId }),
      getAllEpics({ projectId, searchQuery: '' }),
    ]);
  if (!project) return notFound();
  if (!epic) return notFound();
  if (!notionResult) return notFound(); // or return empty placeholder if Notion is optional
  const notion: any = notionResult;
  const [profile, members] = await Promise.all([getProfile(), getMembers()]);

  return (
    <ActiveOrganizationMembersProvider members={members}>
      <ActiveProjectProvider project={project}>
        <ActiveEpicProvider epic={epic}>
          <ActiveNotionProvider notion={notion}>
            <EpicSidebar
              profile={profile}
              advancedToolCategories={advancedToolCategories}
              allEpics={allEpics}
            />
            {/* Set max-width so full-width tables can overflow horizontally correctly */}
            <SidebarInset
              id="skip"
              className="size-full lg:[transition:max-width_0.2s_linear] lg:peer-data-[state=collapsed]:max-w-[calc(100svw-var(--sidebar-width-icon))] lg:peer-data-[state=expanded]:max-w-[calc(100svw-var(--sidebar-width))]"
            >
              <div className="flex flex-row h-screen overflow-hidden">
                <div className="size-full">{props.children}</div>
              </div>
            </SidebarInset>
          </ActiveNotionProvider>
        </ActiveEpicProvider>
      </ActiveProjectProvider>
    </ActiveOrganizationMembersProvider>
  );
}
