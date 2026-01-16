'use client';

import { useRouter } from 'next/navigation';

import { EpicFeedbackType } from '@workspace/database';
import { Button } from '@workspace/ui/components/button';

import { useActiveEpic } from '~/hooks/use-active-epic';
import { EpicFeedbackWidget } from '../../epic-feedback-widget';
import { useEpicSteps } from '../use-epic-steps';
import DesignFileDragDrop from './nested-drag-drop';

export function DescribeScreens() {
  const router = useRouter();
  const activeEpic = useActiveEpic();
  const { stepUrls } = useEpicSteps();

  const handlePreviousStep = () => router.push(stepUrls.uploadUIScreensUrl);
  const handleNextStep = () => {
    router.push(stepUrls.backendLogicUrl);
  };

  const feedbackGiven = activeEpic.epicFeedbacks?.find(
    (feedback) => feedback.type === EpicFeedbackType.AI_ANALYSIS_OF_FILES,
  );

  return (
    <section id="describe-screens" className="max-w-5xl mx-auto">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">Describe UI Screens</h1>
          <p className="text-muted-foreground">
            Add descriptions for each screen and drag to reorder them
          </p>
        </div>
      </div>

      <div className="my-4">
        <DesignFileDragDrop designFiles={activeEpic?.designFiles || []} />
      </div>

      <div className="my-4">
        {!feedbackGiven && (
          <EpicFeedbackWidget
            epicId={activeEpic.id}
            feedbackType={EpicFeedbackType.AI_ANALYSIS_OF_FILES}
          />
        )}
      </div>

      <div className="flex justify-between mt-8 sticky bottom-0 bg-white py-4 mx-9">
        <Button variant="outline" onClick={handlePreviousStep} disabled>
          Previous Step
        </Button>
        <Button onClick={handleNextStep}>Next Step</Button>
      </div>
    </section>
  );
}
