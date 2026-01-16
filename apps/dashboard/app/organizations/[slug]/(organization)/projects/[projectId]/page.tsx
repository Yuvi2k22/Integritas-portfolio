import { notFound } from 'next/navigation';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import {
  Page,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageTitle
} from '@workspace/ui/components/page';
import { SidebarInset } from '@workspace/ui/components/sidebar';

import { AppSidebar } from '~/components/organizations/slug/app-sidebar';
import { searchParamsCache } from '~/components/organizations/slug/projects/epics/epics-search-params';
import { EpicsDataTable } from '~/components/organizations/slug/projects/project/epics-data-table';
import { ProjectHeader } from '~/components/organizations/slug/projects/project/project-header';
import { getProfile } from '~/data/account/get-profile';
import { getEpics } from '~/data/epics/get-epics';
import { getFavorites } from '~/data/favorites/get-favorites';
import { getOrganizations } from '~/data/organization/get-organizations';
import { getProject } from '~/data/projects/get-project';
import { ActiveProjectProvider } from '~/hooks/use-active-project';
import { TransitionProvider } from '~/hooks/use-transition-context';

const paramsCache = createSearchParamsCache({
  projectId: parseAsString.withDefault('')
});

export default async function ProjectPage(props: NextPageProps) {
  const { projectId } = await paramsCache.parse(props.params);
  const searchParams = await searchParamsCache.parse(props.searchParams);

  const project = await getProject({ projectId });
  if (!project) {
    return notFound();
  }

  const [organizations, favorites, profile, { epics, filteredCount }] =
    await Promise.all([
      getOrganizations(),
      getFavorites(),
      getProfile(),
      getEpics({ ...searchParams, projectId })
    ]);

  return (
    <TransitionProvider>
      <ActiveProjectProvider project={project}>
        <AppSidebar
          organizations={organizations}
          favorites={favorites}
          profile={profile}
        />
        {/* Set max-width so full-width tables can overflow horizontally correctly */}
        <SidebarInset
          id="skip"
          className="size-full lg:[transition:max-width_0.2s_linear] lg:peer-data-[state=collapsed]:max-w-[calc(100svw-var(--sidebar-width-icon))] lg:peer-data-[state=expanded]:max-w-[calc(100svw-var(--sidebar-width))]"
        >
          <div className="flex flex-row h-screen overflow-hidden">
            <div className="size-full">
              {/* Main Page Contents */}
              <Page>
                <PageHeader>
                  <PagePrimaryBar className="flex-1">
                    <div className="flex flex-row items-center gap-4">
                      <PageTitle className="flex-1">
                        Project - {project.name}
                      </PageTitle>
                    </div>
                    {/* <ProjectPageActions project={project} /> */}
                  </PagePrimaryBar>
                </PageHeader>
                <PageBody
                  disableScroll
                  className="flex flex-col h-full overflow-auto md:flex-row md:divide-x md:overflow-hidden"
                >
                  <div className="container py-8 mx-auto">
                    <ProjectHeader profile={profile} />

                    <EpicsDataTable
                      profile={profile}
                      data={epics}
                      totalCount={filteredCount}
                    />
                  </div>
                </PageBody>
              </Page>
            </div>
          </div>
        </SidebarInset>
      </ActiveProjectProvider>
    </TransitionProvider>
  );
}
