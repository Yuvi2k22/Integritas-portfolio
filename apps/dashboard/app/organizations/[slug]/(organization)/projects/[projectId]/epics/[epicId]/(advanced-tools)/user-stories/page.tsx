import { Page, PageBody, PageHeader } from "@workspace/ui/components/page";

import UserStoriesTable from "~/components/organizations/slug/projects/epics/advanced-tools/user-stories/user-story-data-table";
import { UserStoryGenerator } from "~/components/organizations/slug/projects/epics/advanced-tools/user-stories/user-story-generator";
import { UserStoryPageHeader } from "~/components/organizations/slug/projects/epics/advanced-tools/user-stories/user-story-page-header";
import { getUserStories } from "~/data/user-stories/get-user-stories";
import { TransitionProvider } from "~/hooks/use-transition-context";

interface PageProps {
  params: {
    projectId: string;
    epicId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function UserStoriesPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { projectId, epicId } = resolvedParams;
  const data = await getUserStories({
    epicId,
    pageIndex: 0,
    pageSize: 100,
  });
  return (
    <TransitionProvider>
      <div
        id="user-story-disable"
        className="flex flex-row h-screen overflow-auto"
      >
        <div className="size-full">
          {/* Main Page Contents */}
          <Page>
            {data.userStories.length > 0 ? (
              <>
                <PageHeader className="container mx-auto">
                  <UserStoryPageHeader
                    acceptanceCrieriaGenerate={data.acceptanceCriteriaGenerate}
                    notionExportEnable={data.notionExportEnable}
                  />
                </PageHeader>

                <PageBody className="container mx-auto" disableScroll>
                  <UserStoriesTable userStories={data.userStories} />
                </PageBody>
              </>
            ) : (
              <UserStoryGenerator projectId={projectId} epicId={epicId} />
            )}
          </Page>
        </div>
      </div>
    </TransitionProvider>
  );
}
