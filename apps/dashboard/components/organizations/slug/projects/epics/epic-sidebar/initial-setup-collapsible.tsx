import { useState } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  ChevronRightIcon,
  FileCheckIcon,
  FileCode,
  FileTextIcon,
  ImageIcon,
  LayoutListIcon,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import { SidebarMenuButton } from '@workspace/ui/components/sidebar';

import { useEpicSteps } from '../steps/use-epic-steps';

export function InitialSetupCollapsible() {
  const [isInitialSetupOpen, setIsInitialSetupOpen] = useState<boolean>(true);
  const { stepUrls, stepsCompleted } = useEpicSteps();

  const steps = [
    {
      stepNumber: 1,
      label: 'Upload UI Images',
      icon: <ImageIcon className="w-5 h-5" />,
      url: stepUrls.uploadUIScreensUrl,
      canVisit: false,
      completed: stepsCompleted >= 1,
    },
    {
      stepNumber: 2,
      label: 'Arrange & Describe',
      icon: <LayoutListIcon className="w-5 h-5" />,
      url: stepUrls.describeScreensUrl,
      canVisit: stepsCompleted >= 2,
      completed: stepsCompleted >= 2,
    },
    {
      stepNumber: 3,
      label: 'Backend Logics',
      icon: <FileCode className="w-5 h-5" />,
      url: stepUrls.backendLogicUrl,
      canVisit: stepsCompleted >= 2,
      completed: stepsCompleted >= 2.1,
    },
    {
      stepNumber: 4,
      label: 'Confirm App Flow',
      icon: <FileTextIcon className="w-5 h-5" />,
      url: stepUrls.appFlowUrl,
      canVisit: stepsCompleted >= 2.1,
      completed: stepsCompleted >= 3,
    },
    {
      stepNumber: 5,
      label: 'Screen Docs',
      icon: <FileCheckIcon className="w-5 h-5" />,
      url: stepUrls.screenDocsUrl,
      canVisit: stepsCompleted >= 3,
      completed: stepsCompleted >= 4,
    },
  ];

  return (
    <div className="px-6 py-2">
      <Collapsible
        open={isInitialSetupOpen}
        onOpenChange={setIsInitialSetupOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <span>Initial Setup</span>
          <ChevronRightIcon
            className={`h-4 w-4 transition-transform ${isInitialSetupOpen ? 'rotate-90' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          {steps.map((step) => (
            <SidebarMenuButton asChild key={step.stepNumber}>
              <Link
                href={step.canVisit ? step.url : '#'}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors relative group ${
                  step.canVisit
                    ? 'hover:bg-sidebar-accent'
                    : 'cursor-not-allowed opacity-50'
                }`}
                aria-disabled={step.canVisit ? 'false' : 'true'}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-5 h-5 text-xs border rounded-full">
                    {step.stepNumber}
                  </span>
                  {step.icon}
                </div>
                <span>{step.label}</span>
                {step.completed && (
                  <CheckIcon className="absolute w-4 h-4 text-green-500 right-3" />
                )}
              </Link>
            </SidebarMenuButton>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
