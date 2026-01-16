'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import NiceModal from '@ebay/nice-modal-react';

import { EpicFeedbackType } from '@workspace/database';
import { Button } from '@workspace/ui/components/button';
import { TogglePointerEvents } from '@workspace/ui/components/pointer-control';
import { toast } from '@workspace/ui/components/sonner';

import { deleteDesignFiles } from '~/actions/design-files/delete-design-files';
import { MarkdownEditor } from '~/components/editor/markdown-editor';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveProject } from '~/hooks/use-active-project';
import { EpicFeedbackWidget } from '../../epic-feedback-widget';
import { useEpicSteps } from '../use-epic-steps';
import { ExportPdfModal } from './export-pdf-modal';
import { ScreenItem } from './screen-item';
import { useScreenItems } from './use-screen-items';

export function ScreenDocs() {
  const router = useRouter();
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();
  const { stepUrls, initialStepsCompleted, proceedToNextStep, stepsCompleted } =
    useEpicSteps();
  const { screenItems, generateAllScreens, deleteScreen, isGeneratingAll } =
    useScreenItems();
  const [selectedScreenId, setSelectedScreenId] = useState<string>();
  const fileIdsForDeletionRef = useRef<string[]>([]);
  const deleteFilesTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handlePreviousStep = () => router.push(stepUrls.appFlowUrl);
  const handleNextStep = () => proceedToNextStep();
  const handleDeleteScreenItem = (
    mainScreenId: string,
    subScreenId?: string,
  ) => {
    deleteScreen(mainScreenId, subScreenId);
    if (subScreenId) fileIdsForDeletionRef.current.push(subScreenId);
    else fileIdsForDeletionRef.current.push(mainScreenId);

    if (deleteFilesTimeoutRef.current)
      clearTimeout(deleteFilesTimeoutRef.current);

    deleteFilesTimeoutRef.current = setTimeout(async () => {
      const result = await deleteDesignFiles({
        projectId: activeProject.id,
        epicId: activeEpic.id,
        fileIdsForDeletion: fileIdsForDeletionRef.current,
      });
      if (result?.serverError || result?.validationErrors)
        toast.error("Can't delete screens, Something went wrong");
      else {
        toast.success('Screens delete successfully');
        fileIdsForDeletionRef.current = [];
      }
    }, 1000);
  };
  const handleExportPdf = () =>
    NiceModal.show(ExportPdfModal, { epic: activeEpic });

  useEffect(() => {
    if (screenItems.length !== 0 && !selectedScreenId)
      setSelectedScreenId(screenItems[0].id);
  }, [screenItems, selectedScreenId]);

  useEffect(() => {
    if (isGeneratingAll) {
      TogglePointerEvents({
        pointerEventEnable: true,
        enableSpecificDataAttribute: 'screen-docs',
      });
    } else {
      TogglePointerEvents({
        pointerEventEnable: false,
      });
    }
  }, [isGeneratingAll]);

  const feedbackGiven = activeEpic.epicFeedbacks?.find(
    (feedback) => feedback.type === EpicFeedbackType.SCREEN_DOCS,
  );

  return (
    <div
      id="screen-docs"
      className="px-10 max-w-[2000px] mx-auto h-full flex flex-col"
    >
      <div className="flex flex-wrap flex-1 overflow-hidden">
        {/* Left Column - List of UI Screens */}
        <div className="size-full lg:w-1/3 lg:pr-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">UI Screens</h2>
            <div className="flex items-center gap-2">
              {initialStepsCompleted && (
                <Button
                  variant="outline"
                  className="flex items-center"
                  disabled={isGeneratingAll}
                  onClick={handleExportPdf}
                >
                  Export to PDF
                </Button>
              )}
              <Button
                variant="outline"
                className="flex items-center"
                onClick={generateAllScreens}
                disabled={isGeneratingAll}
              >
                Generate All
              </Button>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {screenItems.map((screenItem) => (
              <ScreenItem
                key={screenItem.id}
                screenItem={screenItem}
                activeScreenItemId={selectedScreenId}
                onSelectScreenItem={setSelectedScreenId}
                onDeleteScreenItem={handleDeleteScreenItem}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Markdown Editor */}
        <div className="size-full lg:w-2/3 lg:pl-4 overflow-hidden">
          {screenItems.map((screenItem) => {
            // Editor for every subscreen
            // const editors = screenItem.subFiles.map((subScreenItem) => (
            //   <div
            //     key={subScreenItem.id}
            //     className={`${selectedScreenId !== subScreenItem.id ? 'hidden' : ''} overflow-hidden size-full flex flex-col`}
            //   >
            //     <h2 className="mt-1 mb-4 text-xl font-medium">
            //       Screen - {subScreenItem.filename}
            //     </h2>
            //     <div className="overflow-y-auto flex-1 py-2">
            //       <MarkdownEditor
            //         markdownContent={subScreenItem.designFlowDoc}
            //         hideToolbar={
            //           screenItem.isGenerating ||
            //           screenItem.designFlowDoc.trim() === ''
            //         }
            //         readOnly={
            //           subScreenItem.isGenerating ||
            //           subScreenItem.designFlowDoc.trim() === ''
            //         }
            //       />
            //     </div>
            //   </div>
            // ));

            // editor for mainscreen followed by subscreen
            return (
              <Fragment key={screenItem.id}>
                <div
                  className={`${selectedScreenId !== screenItem.id ? 'hidden' : ''} overflow-hidden size-full flex flex-col`}
                >
                  <h2 className="mt-1 mb-4 text-xl font-medium">
                    Screen - {screenItem.filename}
                  </h2>
                  <div className="overflow-y-auto flex-1 py-2">
                    <MarkdownEditor
                      markdownContent={screenItem.designFlowDoc}
                      hideToolbar={
                        screenItem.isGenerating ||
                        screenItem.designFlowDoc.trim() === ''
                      }
                      readOnly={
                        screenItem.isGenerating ||
                        screenItem.designFlowDoc.trim() === ''
                      }
                    />
                  </div>
                </div>
                {/* {editors} */}
              </Fragment>
            );
          })}
        </div>
      </div>

      {!feedbackGiven && stepsCompleted >= 4 && (
        <div className="my-2">
          <EpicFeedbackWidget
            epicId={activeEpic.id}
            feedbackType={EpicFeedbackType.SCREEN_DOCS}
          />
        </div>
      )}

      <div className="flex justify-between mt-2 mx-9">
        <Button
          variant="outline"
          disabled={isGeneratingAll}
          onClick={handlePreviousStep}
        >
          Back to App Flow
        </Button>
        <Button
          className="mr-4"
          disabled={isGeneratingAll || !initialStepsCompleted}
          onClick={handleNextStep}
        >
          Finish
        </Button>
      </div>
    </div>
  );
}
