'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';

import { EpicStatus } from '@workspace/database';
import { apiRoutes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import { ImageDropzone } from '@workspace/ui/components/image-dropzone';
import { TogglePointerEvents } from '@workspace/ui/components/pointer-control';
import { Progress } from '@workspace/ui/components/progress';
import { toast } from '@workspace/ui/components/sonner';
import { Textarea } from '@workspace/ui/components/textarea';

import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';
import { useSetState } from '~/hooks/useSetState';
import { DesignFileDto } from '~/types/dtos/design-file-dto';
import { DraggableFileGrid } from './draggable-file-grid';

const loadingMessages = [
  'Analyzing the UI Images',
  'Understanding the flow',
  'Detecting the main screens and sub screens',
  'Arranging the images in the right order',
  'Checking for duplicate screens',
  'Writing the description for each screen',
];
export function UploadUIScreens() {
  const router = useRouter();
  const pathname = usePathname();
  const organization = useActiveOrganization();
  const project = useActiveProject();
  const epic = useActiveEpic();
  const [uploadedFiles, setUploadedFiles] = useState<DesignFileDto[]>([]);
  const [uploadProgress, setUploadProgress] = useSetState({
    isUploading: false,
    uploadProgress: 0,
  });
  const [imageAnalysisProgress, setImageAnalysisProgress] = useState({
    isAnalyzing: false,
    content: '',
  });
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [messageVisible, setMessageVisible] = useState(true);

  // Create a ref for the textarea element to auto-scroll
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectFiles = async (files: File[]) => {
    if (epic.status !== 'DRAFT') return toast.error('You can upload only once');

    const formData = new FormData();
    formData.append('projectId', project.id);
    formData.append('epicId', epic.id);

    files.forEach((file) => formData.append('files', file));

    const abortController = new AbortController();
    const response = await axios.post(
      apiRoutes.projects.epics.uploadUIFiles,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-organization-slug': organization.slug,
        },
        signal: abortController.signal,
        onUploadProgress: () => {
          setUploadProgress({ isUploading: true });
        },
      },
    );
    if (response.status === 200) {
      setUploadProgress({ isUploading: true, uploadProgress: 100 });
      setTimeout(() => {
        setUploadProgress({ isUploading: false, uploadProgress: 0 });
      }, 500);
    } else {
      toast.error("Something wen't wrong while uploading");
    }

    router.refresh();
  };
  useEffect(() => {
    if (!uploadProgress?.isUploading || uploadProgress.uploadProgress >= 95)
      return;

    const timer = setInterval(() => {
      setUploadProgress({
        uploadProgress: Math.min(uploadProgress?.uploadProgress + 5, 95),
      });
    }, 600);

    return () => clearInterval(timer);
  }, [uploadProgress?.isUploading, uploadProgress?.uploadProgress]);

  const handleFileSelectError = (error: Error) => {
    if (error.message.includes('Too many files'))
      toast.error(
        `You can upload only ${20 - uploadedFiles.length} more files`,
      );
  };

  // Timer for image analysis progress: only runs while analysis is in progress
  useEffect(() => {
    if (!imageAnalysisProgress.isAnalyzing) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        // Increment slowly but never go past 95%
        if (prev < 95) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [imageAnalysisProgress.isAnalyzing]);

  // Rotate through loading messages with animation
  useEffect(() => {
    // If there's content, immediately set the final message and don't rotate further.
    if (imageAnalysisProgress.content) {
      setCurrentMessageIndex(loadingMessages.length - 1);
      return;
    }

    if (currentMessageIndex == loadingMessages.length - 1) {
      return;
    }

    const messageInterval = setInterval(() => {
      setMessageVisible(false);

      setTimeout(() => {
        setCurrentMessageIndex((prev) =>
          prev < loadingMessages.length - 1 ? prev + 1 : prev,
        );
        setMessageVisible(true);
      }, 300); // match this to your CSS transition duration
    }, 15000);

    return () => clearInterval(messageInterval);
  }, [imageAnalysisProgress.content]);

  const handleProceedNextStep = async () => {
    if (epic.status !== EpicStatus.UPLOAD_COMPLETED)
      return router.push(
        pathname.replace('/upload-ui-screens', '/describe-screens'),
      );

    // Start the analysis phase and reset progress
    setImageAnalysisProgress({ isAnalyzing: true, content: '' });
    TogglePointerEvents({
      pointerEventEnable: true,
      enableSpecificDataAttribute: 'upload-ui-screens',
    });
    setProgress(0);
    const response = await fetch(apiRoutes.projects.epics.analyzeUIFiles, {
      method: 'POST',
      headers: { 'x-organization-slug': organization.slug },
      body: JSON.stringify({ projectId: project.id, epicId: epic.id }),
    });

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();

    if (reader) {
      let content = '';
      while (true) {
        const { done, value } = await reader.read();
        if (value) {
          content += value.replace(/\*/g, '');
          setImageAnalysisProgress({ isAnalyzing: true, content });
        }
        if (done) {
          // When the stream is done, complete the progress
          setProgress(100);
          router.refresh();
          // Added time delay to wait for page refresh to complete
          setTimeout(() => {
            TogglePointerEvents({
              pointerEventEnable: false,
            });
          }, 500);
          break;
        }
      }
    } else {
      TogglePointerEvents({
        pointerEventEnable: false,
      });
    }
  };

  // Auto-scroll effect: scroll the textarea to the bottom whenever new content is added.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [imageAnalysisProgress.content]);

  const maxFiles = 20 - uploadedFiles.length;

  useEffect(() => {
    if (epic.status === EpicStatus.AI_ANALYSIS_COMPLETED) {
      setTimeout(() => {
        setCurrentMessageIndex(0);
        setMessageVisible(false);
      }, 2000);
      router.push(pathname.replace('/upload-ui-screens', '/describe-screens'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epic.status, imageAnalysisProgress.isAnalyzing]);

  useEffect(() => {
    if (epic.designFiles) setUploadedFiles(epic.designFiles);
  }, [epic]);

  return (
    <section id="upload-ui-screens" className="max-w-5xl mx-auto">
      <h1 className="mb-2 text-2xl font-semibold">Upload UI Screens</h1>
      <p className="mb-8 text-muted-foreground">
        Upload up to 20 screenshots of your application's UI screens
      </p>
      {uploadProgress.isUploading && (
        <div className="flex items-center justify-center border border-dashed rounded-md min-h-64">
          <div className="flex flex-col items-center w-3/4 gap-2">
            <h1>Uploading screens ({uploadProgress.uploadProgress}%)</h1>
            <Progress value={uploadProgress.uploadProgress} />
          </div>
        </div>
      )}

      {!uploadProgress.isUploading && !imageAnalysisProgress.isAnalyzing && (
        <>
          <ImageDropzone
            title="Upload UI Screens"
            accept={{ 'image/*': [] }}
            multiple
            maxFiles={maxFiles}
            onDrop={handleSelectFiles}
            onError={handleFileSelectError}
            className="h-80"
            disabled={
              uploadedFiles.length >= 20 || epic.status !== EpicStatus.DRAFT
            }
          />

          {uploadedFiles.length > 0 && (
            <DraggableFileGrid
              designFiles={uploadedFiles}
              onChange={setUploadedFiles}
            />
          )}

          <div className="flex justify-end py-4 my-4 sticky bottom-0 bg-background mx-9">
            <Button
              disabled={uploadedFiles.length === 0}
              onClick={handleProceedNextStep}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {imageAnalysisProgress.isAnalyzing && (
        <>
          <div className="flex flex-col items-center justify-center w-full">
            <Loader2Icon className="w-12 h-12 mb-6 text-primary animate-spin" />

            <div className="h-10 mb-2 overflow-hidden">
              <h2
                className={`text-2xl font-semibold transition-all duration-300 ease-in-out transform ${
                  messageVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                {loadingMessages[currentMessageIndex]}
              </h2>
            </div>

            <div className="w-[90%] h-2 mb-8 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full transition-all duration-200 ease-in-out rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="container items-center justify-center w-[90%] p-4 rounded">
            {imageAnalysisProgress.content.trim() && (
              <Textarea
                ref={textareaRef}
                value={imageAnalysisProgress.content.replace(
                  /<\/?(?:screenshot_analysis|app_flow_analysis)>/g,
                  '',
                )}
                readOnly
                className="font-mono text-sm resize-none h-60 opacity-80"
              />
            )}
          </div>
        </>
      )}
    </section>
  );
}
