import { Suspense } from 'react';
import { Metadata } from 'next';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import {
  Page,
  PageActions,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageTitle,
} from '@workspace/ui/components/page';
import { SidebarInset } from '@workspace/ui/components/sidebar';

import { AppSidebar } from '~/components/organizations/slug/app-sidebar';
import { ProjectsDataTable } from '~/components/organizations/slug/projects/projects-data-table';
import { ProjectsPageHeader } from '~/components/organizations/slug/projects/projects-page-header';
import { searchParamsCache } from '~/components/organizations/slug/projects/projects-search-params';
import { getProfile } from '~/data/account/get-profile';
import { getFavorites } from '~/data/favorites/get-favorites';
import { getOrganizations } from '~/data/organization/get-organizations';
import { getProjects } from '~/data/projects/get-projects';
import { TransitionProvider } from '~/hooks/use-transition-context';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Projects'),
};

export default async function ProjectsPage(props: NextPageProps) {
  const parsedSearchParams = await searchParamsCache.parse(props.searchParams);
  const ctx = await getAuthOrganizationContext();

  const [organizations, favorites, profile] = await Promise.all([
    getOrganizations(),
    getFavorites(),
    getProfile(),
  ]);
  const { projects, filteredCount } = await getProjects(parsedSearchParams);

  return (
    <TransitionProvider>
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
        <div className="flex h-screen flex-row overflow-auto">
          <div className="size-full">
            {/* Main Page Contents */}
            <Page>
              <PageHeader>
                <PagePrimaryBar>
                  <div className="flex flex-row items-center gap-1">
                    <PageTitle>
                      Organization - {ctx.organization.name}
                    </PageTitle>
                  </div>
                  <PageActions>{/* <AddProjectButton /> */}</PageActions>
                </PagePrimaryBar>
              </PageHeader>
              <PageBody className="container mx-auto" disableScroll>
                <ProjectsPageHeader profile={profile} />
                <Suspense>
                  <ProjectsDataTable
                    data={projects}
                    totalCount={filteredCount}
                  />
                </Suspense>
              </PageBody>
            </Page>
          </div>
        </div>
      </SidebarInset>
    </TransitionProvider>
  );
}
