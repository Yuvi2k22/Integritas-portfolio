'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckIcon } from 'lucide-react';

import { replaceRouteSlugs, routes, RouteSlugs } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';

import { useEpicSteps } from './use-epic-steps';

export function InitialSetupStepper() {
  const router = useRouter();
  const params = useParams<{
    slug: string;
    projectId: string;
    epicId: string;
  }>();
  const { stepUrls, stepsCompleted } = useEpicSteps();

  const projectPageUrl = useMemo(() => {
    return replaceRouteSlugs(
      routes.dashboard.organizations.slug.projects.project.Index,
      {
        [RouteSlugs.OrgSlug]: params.slug,
        [RouteSlugs.ProjectSlug]: params.projectId
      }
    );
  }, [params]);

  const steps = [
    {
      stepNumber: 1,
      label: 'Upload Screens',
      url: stepUrls.uploadUIScreensUrl,
      canVisit: false,
      completed: stepsCompleted >= 1
    },
    {
      stepNumber: 2,
      label: 'Describe Screens',
      url: stepUrls.describeScreensUrl,
      canVisit: stepsCompleted >= 2,
      completed: stepsCompleted >= 2
    },
    {
      stepNumber: 3,
      label: 'Backend Logics',
      url: stepUrls.backendLogicUrl,
      canVisit: stepsCompleted >= 2,
      completed: stepsCompleted >= 2.1
    },
    {
      stepNumber: 4,
      label: 'Create App Flow',
      url: stepUrls.appFlowUrl,
      canVisit: stepsCompleted >= 2.1,
      completed: stepsCompleted >= 3
    },
    {
      stepNumber: 5,
      label: 'Screen wise documentation',
      url: stepUrls.screenDocsUrl,
      canVisit: stepsCompleted >= 3,
      completed: stepsCompleted >= 4
    }
  ];

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <Button
        variant="ghost"
        className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        onClick={() => router.push(projectPageUrl)}
      >
        ← Back to Features Page
      </Button>
      <div className="flex items-center justify-between mt-4">
        {steps.map((step, index) => {
          const handleClick = () => {
            if (step.canVisit) router.push(step.url);
          };

          return (
            <div
              key={step.stepNumber}
              className="flex items-center"
            >
              {/* Step Container */}
              <div
                className={`flex items-center gap-4 ${
                  step.canVisit ? 'cursor-pointer' : ''
                }`}
                onClick={handleClick}
              >
                {/* Step Indicator */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.completed ? 'bg-primary text-white' : 'border'
                  }`}
                >
                  <span className="text-sm dark:text-black">
                    {step.completed ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      step.stepNumber
                    )}
                  </span>
                </div>

                {/* Step Label */}
                <span
                  className={
                    step.canVisit ? 'font-medium' : 'text-muted-foreground'
                  }
                >
                  {step.label}
                </span>
              </div>

              {/* Line between steps */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-4 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
