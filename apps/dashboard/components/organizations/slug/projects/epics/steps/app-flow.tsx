'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import NiceModal from '@ebay/nice-modal-react';
import { Editor, EditorEvents } from '@tiptap/react';
import { InfoIcon, RefreshCwIcon } from 'lucide-react';

import { EpicFeedbackType, EpicStatus } from '@workspace/database';
import { convertHtmlToMarkdown } from '@workspace/markdown/convert-html-to-markdown';
import { apiRoutes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import { CustomTooltip } from '@workspace/ui/components/custom-tooltip';
import { TogglePointerEvents } from '@workspace/ui/components/pointer-control';
import { toast } from '@workspace/ui/components/sonner';

import { updateEpicFlow } from '~/actions/epics/update-epic-flow';
import { MarkdownEditor } from '~/components/editor/markdown-editor';
import { StorageKeys } from '~/config/storage-keys';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';
import { ProfileDto } from '~/types/dtos/profile-dto';
import { UpgradeToProDialog } from '../advanced-tools/common/upgrade-to-pro-dialog';
import { EpicFeedbackWidget } from '../epic-feedback-widget';
import { useEpicSteps } from './use-epic-steps';

export function AppFlow({ profile }: { profile: ProfileDto }) {
  const router = useRouter();
  const activeOrganization = useActiveOrganization();
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();
  const { stepUrls, stepsCompleted } = useEpicSteps();
  const editorRef = useRef<Editor>(undefined);
  const contentEditDebounceTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');

  const handleGenerate = async () => {
    setContent('');
    setIsGenerating(true);
    TogglePointerEvents({
      pointerEventEnable: true,
      enableSpecificDataAttribute: 'app-flow',
    });
    try {
      const response = await fetch(apiRoutes.projects.epics.generateAppFlow, {
        method: 'POST',
        headers: { 'x-organization-slug': activeOrganization.slug },
        body: JSON.stringify({
          projectId: activeProject.id,
          epicId: activeEpic.id,
        }),
      });

      const streamReader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();

      if (streamReader) {
        let flow = '';
        while (true) {
          const { value, done } = await streamReader.read();
          if (value) {
            flow += value;
            setContent(flow);
          }

          if (done) {
            setIsGenerating(false);
            router.refresh();
            TogglePointerEvents({
              pointerEventEnable: false,
            });
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      TogglePointerEvents({
        pointerEventEnable: false,
      });
    }
  };

  const handleSaveFlow = async (flow: string) => {
    const result = await updateEpicFlow({
      epicId: activeEpic.id,
      projectId: activeProject.id,
      epicFlowDoc: flow,
    });

    if (result?.validationErrors || result?.serverError)
      return toast.error("Can't save changes. something went wrong");
  };

  const handleContentEdited = (props: EditorEvents['update']) => {
    const { editor, transaction } = props;

    if (contentEditDebounceTimeoutRef.current)
      clearTimeout(contentEditDebounceTimeoutRef.current);

    contentEditDebounceTimeoutRef.current = setTimeout(() => {
      if (transaction.docChanged) {
        const editedFlow = convertHtmlToMarkdown(editor.getHTML());
        handleSaveFlow(editedFlow);
        toast.success('App Flow Saved');
      }
    }, 2000);
  };
  const handlePreviousStep = () => router.push(stepUrls.backendLogicUrl);
  const handleNextStep = () => {
    if (activeEpic.status === EpicStatus.APP_FLOW_GENERATED) {
      // autogenerate screen-docs before 10 seconds from now
      sessionStorage.setItem(
        StorageKeys.AUTO_GENERATE_SCREEN_DOCS_BEFORE,
        Date.now() + 10000 + '',
      );
    }
    router.push(stepUrls.screenDocsUrl);
  };

  useEffect(() => {
    if (activeEpic.epicFlowDoc) setContent(activeEpic.epicFlowDoc);
  }, [activeEpic]);

  useEffect(() => {
    if (activeEpic && !isGenerating && !activeEpic?.epicFlowDoc) {
      const autoGenerateBefore = parseInt(
        sessionStorage.getItem(
          StorageKeys.AUTO_GENERATE_APP_FLOW_BEFORE,
        ) as string,
      );

      if (!Number.isNaN(autoGenerateBefore) && Date.now() < autoGenerateBefore)
        handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEpic, isGenerating]);

  const generateButtonText = (() => {
    if (isGenerating) return 'Generating...';
    if (activeEpic.epicFlowDoc === '') return 'Generate App Flow';
    else return 'Re-Generate App Flow';
  })();

  const feedbackGiven = activeEpic.epicFeedbacks?.find(
    (feedback) => feedback.type === EpicFeedbackType.APPFLOW,
  );

  return (
    <section id="app-flow" className="max-w-5xl mx-auto">
      {/* header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">App Features & Flow</h1>
        <p className="text-muted-foreground">
          Here's your app's user flow & feature list. Please read and make sure
          it's accurate before proceeding with the next steps.
        </p>

        <div className="flex items-center my-6">
          <Button
            onClick={() =>
              generateButtonText === 'Re-Generate App Flow' &&
              activeOrganization.tier === 'free'
                ? NiceModal.show(UpgradeToProDialog, {
                    organizationName: activeOrganization.name,
                    email: profile.email,
                    organizationSlug: activeOrganization.slug,
                  })
                : handleGenerate()
            }
            disabled={
              isGenerating ||
              (activeEpic?.reGenerateCount &&
              activeEpic.reGenerateCount > 2 &&
              activeOrganization.tier !== 'free'
                ? true
                : false)
            }
            variant="outline"
            className="flex items-center gap-2"
          >
            {isGenerating && <RefreshCwIcon className="w-4 h-4 animate-spin" />}
            {generateButtonText}
          </Button>
          {generateButtonText === 'Re-Generate App Flow' &&
            activeOrganization.tier !== 'free' && (
              <CustomTooltip
                content={
                  typeof activeEpic?.reGenerateCount === 'number' &&
                  activeEpic.reGenerateCount > 2
                    ? `Regeneration limit exceeded for this feature. (3/3 used)`
                    : `You can regenerate this feature up to 3 times. (${activeEpic?.reGenerateCount || 0}/3 used)`
                }
              >
                <span className="ml-2 text-black">
                  <InfoIcon className="w-4 h-4" />
                </span>
              </CustomTooltip>
            )}
        </div>
      </div>

      <div className="my-4">
        <MarkdownEditor
          onEditorInit={(editor) => (editorRef.current = editor)}
          onContentEdited={handleContentEdited}
          markdownContent={content}
          readOnly={isGenerating}
        />
      </div>

      <div className="my-4">
        {!feedbackGiven && stepsCompleted >= 3 && (
          <EpicFeedbackWidget
            epicId={activeEpic.id}
            feedbackType={EpicFeedbackType.APPFLOW}
          />
        )}
      </div>

      <div className="flex justify-between mt-8 sticky bottom-0 bg-white py-4 mx-9">
        <Button
          variant="outline"
          disabled={isGenerating}
          onClick={handlePreviousStep}
        >
          Previous Step
        </Button>
        <Button
          disabled={isGenerating || stepsCompleted < 3}
          onClick={handleNextStep}
        >
          Next Step
        </Button>
      </div>
    </section>
  );
}
