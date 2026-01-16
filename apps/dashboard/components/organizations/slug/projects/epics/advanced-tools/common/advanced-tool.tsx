'use client';

import { useEffect, useRef, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { Editor, EditorEvents } from '@tiptap/react';
import { InfoIcon, RefreshCwIcon } from 'lucide-react';

import { EpicFeedbackType } from '@workspace/database';
import { convertHtmlToMarkdown } from '@workspace/markdown/convert-html-to-markdown';
import { convertMarkdownToHtml } from '@workspace/markdown/convert-markdown-to-html';
import { apiRoutes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import { CustomTooltip } from '@workspace/ui/components/custom-tooltip';
import { TogglePointerEvents } from '@workspace/ui/components/pointer-control';
import { toast } from '@workspace/ui/components/sonner';

import { updateAdvancedToolContent } from '~/actions/advanced-tools/update-advanced-tool-content';
import { useSessionRecording } from '~/app/posthog-provider';
import { MarkdownEditor } from '~/components/editor/markdown-editor';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';
import { AdvancedToolDto } from '~/types/dtos/advanced-tool-dto';
import { EpicFeedbackWidget } from '../../epic-feedback-widget';
import { AdvancedToolGenerator } from './advanced-tool-generator';
import { UpgradeToProDialog } from './upgrade-to-pro-dialog';

type AdvancedToolProps = {
  tool: AdvancedToolDto;
  generatedContent: string;
  reGenerateCount: number;
};

export function AdvancedTool(props: AdvancedToolProps) {
  const { tool, generatedContent, reGenerateCount } = props;
  const activeOrganization = useActiveOrganization();
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();
  const editorRef = useRef<Editor>(undefined);
  const contentRef = useRef<string>('');
  const contentEditDebounceTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [generateCount, setGenerateCount] = useState(0);
  const [contentEdited, setContentEdited] = useState(false);
  const { startRecording } = useSessionRecording();

  useEffect(() => {
    if (reGenerateCount > 0) {
      setGenerateCount(reGenerateCount);
    }
  }, [reGenerateCount]);

  const handleGenerate = async (regeneration?: boolean) => {
    startRecording({
      eventName: `Tool : ${tool.name}`,
      organizationName: activeOrganization.name,
    });
    setIsGenerating(true);
    setEditorContent('');
    TogglePointerEvents({
      pointerEventEnable: true,
      enableSpecificDataAttribute: 'advanced-tool-root',
    });

    try {
      const response = await fetch(
        apiRoutes.projects.epics.generateAdvancedTool,
        {
          method: 'POST',
          headers: { 'x-organization-slug': activeOrganization.slug },
          body: JSON.stringify({
            projectId: activeProject.id,
            epicId: activeEpic.id,
            toolId: tool.id,
          }),
        },
      );

      const streamReader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();

      if (streamReader) {
        let content = '';
        while (true) {
          const { value, done } = await streamReader.read();

          if (value) {
            content += value;
            setEditorContent(content);
          }

          if (done) {
            if (regeneration === true) setGenerateCount(generateCount + 1);
            setIsGenerating(false);
            setContentEdited(false);
            contentRef.current = content;
            TogglePointerEvents({ pointerEventEnable: false });
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please try again!');
      TogglePointerEvents({ pointerEventEnable: false });
    }
  };

  const handleSaveFlow = async (content: string) => {
    const result = await updateAdvancedToolContent({
      projectId: activeProject.id,
      epicId: activeEpic.id,
      toolId: tool.id,
      content,
    });

    if (result?.validationErrors || result?.serverError)
      return toast.error("Can't save changes. something went wrong");
  };

  const handleContentEdited = (props: EditorEvents['update']) => {
    const { transaction } = props;

    if (!transaction.docChanged) return;
    setContentEdited(true);
  };

  const handleCancelChanges = () => {
    if (editorRef.current) {
      editorRef.current.commands.setContent(
        convertMarkdownToHtml(contentRef.current),
      );
      setContentEdited(false);
    }
  };

  const handleSaveChanges = () => {
    if (editorRef.current) {
      const content = convertHtmlToMarkdown(editorRef.current.getHTML());
      handleSaveFlow(content);
      setContentEdited(false);
      toast.success(`${tool.name} updated`);
    }
  };

  useEffect(() => {
    if (generatedContent.trim() !== '') setEditorContent(generatedContent);

    contentRef.current = generatedContent;
    setContentEdited(false);
  }, [generatedContent]);

  const feedbackGiven = activeEpic.epicFeedbacks?.find(
    (feedback) =>
      feedback.type === EpicFeedbackType.ADVANCED_TOOLS &&
      feedback.advancedToolId === tool.id,
  );

  return (
    <section id="advanced-tool-root" className="h-full">
      {generatedContent.trim() === '' &&
      editorContent.trim() === '' &&
      !isGenerating ? (
        <AdvancedToolGenerator
          toolName={tool.name}
          description={tool.description}
          onGenerate={handleGenerate}
        />
      ) : (
        <div className="flex flex-col max-w-5xl mx-auto">
          <div className="mt-8 mb-2">
            <h1 className="mb-2 text-2xl font-semibold">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.description}</p>

            <div className="flex items-center my-6 relative">
              <Button
                onClick={() =>
                  !isGenerating && activeOrganization.tier === 'free'
                    ? NiceModal.show(UpgradeToProDialog, {
                        organizationName: activeOrganization.name,
                        organizationSlug: activeOrganization.slug,
                      })
                    : handleGenerate(true)
                }
                disabled={isGenerating || generateCount > 2}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isGenerating && (
                  <RefreshCwIcon className="w-4 h-4 animate-spin" />
                )}
                {isGenerating
                  ? `Generating ${tool.name}`
                  : `Re-generate ${tool.name}`}
              </Button>

              {!isGenerating && activeOrganization.tier !== 'free' && (
                <CustomTooltip
                  content={
                    generateCount > 2
                      ? `Regeneration limit exceeded for this tool. (3/3 used)`
                      : `You can regenerate this tool up to 3 times. (${generateCount || 0}/3 used)`
                  }
                >
                  <span className="ml-2 text-black">
                    <InfoIcon className="w-4 h-4" />
                  </span>
                </CustomTooltip>
              )}
            </div>
          </div>

          <MarkdownEditor
            onEditorInit={(editor) => (editorRef.current = editor)}
            onContentEdited={handleContentEdited}
            markdownContent={editorContent}
            contentEdited={contentEdited}
            readOnly={isGenerating}
            onCancel={handleCancelChanges}
            onSave={handleSaveChanges}
          />

          <div className="my-4">
            {!feedbackGiven && (
              <EpicFeedbackWidget
                epicId={activeEpic.id}
                feedbackType={EpicFeedbackType.ADVANCED_TOOLS}
                advancedToolId={tool.id}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
