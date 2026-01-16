import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { EpicStatus } from '@workspace/database';
import { replaceRouteSlugs, routes, RouteSlugs } from '@workspace/routes';

import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';

// Custom hook to manage epic step navigation logic
export function useEpicSteps() {
  // Initialize router to handle navigation
  const router = useRouter();

  // Get active organization, project, and epic using custom hooks
  const activeOrganization = useActiveOrganization();
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();

  /**
   * useMemo ensures these URLs are only recomputed when activeOrganization, activeProject, or activeEpic change.
   * Generates URLs for each step in the epic workflow.
   */
  const { userStoriesUrl, stepUrls, epicUrl } = useMemo(() => {
    // Define the routes for each step in the epic workflow
    const routesWithSlugs = [
      routes.dashboard.organizations.slug.projects.project.epics.epic.Index,
      routes.dashboard.organizations.slug.projects.project.epics.epic
        .UploadUIScreens,
      routes.dashboard.organizations.slug.projects.project.epics.epic
        .DescribeScreens,
      routes.dashboard.organizations.slug.projects.project.epics.epic
        .BackendLogics,
      routes.dashboard.organizations.slug.projects.project.epics.epic.AppFlow,
      routes.dashboard.organizations.slug.projects.project.epics.epic
        .ScreenDocs,
      routes.dashboard.organizations.slug.projects.project.epics.epic
        .UserStories,
    ];

    // Replace the slugs in each route with the current organization, project, and epic details
    const [
      epicUrl,
      uploadUIScreensUrl,
      describeScreensUrl,
      backendLogicUrl,
      appFlowUrl,
      screenDocsUrl,
      userStoriesUrl,
    ] = routesWithSlugs.map((route) =>
      replaceRouteSlugs(route, {
        [RouteSlugs.OrgSlug]: activeOrganization.slug,
        [RouteSlugs.ProjectSlug]: activeProject.id,
        [RouteSlugs.EpicSlug]: activeEpic.id,
      }),
    );

    // Return the generated step URLs and the user stories URL
    return {
      epicUrl,
      stepUrls: {
        uploadUIScreensUrl,
        describeScreensUrl,
        backendLogicUrl,
        appFlowUrl,
        screenDocsUrl,
      },
      userStoriesUrl,
    };
  }, [activeOrganization, activeProject, activeEpic]);

  /**
   * Memoize the calculation of stepsCompleted to avoid unnecessary re-computation unless activeEpic.status changes. This improves performance by only recalculating when needed.
   * Determine the number of steps completed based on the current epic status.
   */
  const stepsCompleted = useMemo(() => {
    switch (activeEpic.status) {
      case EpicStatus.DRAFT:
        return 0;
      case EpicStatus.UPLOAD_COMPLETED:
        return 1;
      case EpicStatus.AI_ANALYSIS_COMPLETED:
        return 2;
      case EpicStatus.BACKEND_LOGICS_COMPLETED:
        return 2.1;
      case EpicStatus.APP_FLOW_GENERATED:
        return 3;
      case EpicStatus.SCREEN_DOCS_GENERATED:
        return 4;
      default:
        return 0;
    }
  }, [activeEpic.status]);

  /**
   * Determines if the initial steps are completed based on the epic's status.
   * Initial steps are considered completed if the epic has reached the SCREEN_DOCS_GENERATED stage,
   * corresponding to a stepsCompleted value of 4 or higher.
   */
  const initialStepsCompleted = stepsCompleted >= 4;

  /**
   * Function to navigate to the appropriate step based on the current epic status.
   * Resumes from where the user left off in the workflow.
   */
  const resumeWhereLeft = () => {
    // Default to the first step
    let destinationUrl = stepUrls.uploadUIScreensUrl;

    // Determine the correct step based on the epic's current status
    switch (activeEpic.status) {
      case EpicStatus.DRAFT:
      case EpicStatus.UPLOAD_COMPLETED:
        destinationUrl = stepUrls.uploadUIScreensUrl;
        break;
      case EpicStatus.AI_ANALYSIS_COMPLETED:
        destinationUrl = stepUrls.backendLogicUrl;
        break;
      case EpicStatus.BACKEND_LOGICS_COMPLETED:
        destinationUrl = stepUrls.appFlowUrl;
        break;
      case EpicStatus.APP_FLOW_GENERATED:
        destinationUrl = stepUrls.screenDocsUrl;
        break;
      default:
        break;
    }

    // Push the determined URL to the router, navigating the user to the correct step
    router.push(destinationUrl);
  };

  /**
   * Function to proceed to the next step in the epic workflow.
   * Navigates directly to the user stories page.
   */
  const proceedToNextStep = () => {
    router.push(userStoriesUrl);
  };

  // Return the step URLs, a flag for initial steps completion, and the resume function
  return {
    epicUrl,
    stepUrls,
    initialStepsCompleted,
    stepsCompleted,
    resumeWhereLeft,
    proceedToNextStep,
  };
}
