'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { useEpicSteps } from '~/components/organizations/slug/projects/epics/steps/use-epic-steps';

export default function EpicPage() {
  const { initialStepsCompleted, resumeWhereLeft, proceedToNextStep } =
    useEpicSteps();

  useEffect(() => {
    if (!initialStepsCompleted) resumeWhereLeft();
    else proceedToNextStep();
  }, [initialStepsCompleted]);

  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin"></Loader2>
    </div>
  );
}
