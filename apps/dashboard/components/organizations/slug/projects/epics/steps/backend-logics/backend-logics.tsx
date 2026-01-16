'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@workspace/ui/components/sonner';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { TogglePointerEvents } from '@workspace/ui/components/pointer-control';

import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveProject } from '~/hooks/use-active-project';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useEpicSteps } from '../use-epic-steps';

import { apiRoutes } from '@workspace/routes';
import { StorageKeys } from '~/config/storage-keys';
import { DesignFile, SlideshowOverlay } from './slideshow-overlay';
import { MicSelectionModal } from './mic-language-selection-modal';
import { RecordingControls } from './recording-controls';
import { VoiceTranscriptionEditor } from './voice-transcription-editor';
import { TextInputEditor } from './text-input-editor';
import { StepNavigationControls } from './step-navigation-controls';
import { CheckIcon, InfoIcon } from 'lucide-react';
import { CustomTooltip } from '@workspace/ui/components/custom-tooltip';
import NiceModal from '@ebay/nice-modal-react';
import { DeleteBackendLogicAudioDialog } from './audio-delete';

export function BackendLogics() {
  const router = useRouter();
  const activeEpic = useActiveEpic();
  const activeProject = useActiveProject();
  const organization = useActiveOrganization();
  const { stepUrls, stepsCompleted } = useEpicSteps();

  const [backendLogics, setBackendLogics] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioTranscription, setAudioTranscription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<DesignFile[]>([]);
  const [isMicSelectOpen, setIsMicSelectOpen] = useState(false);
  const [selectedMicId, setSelectedMicId] = useState<string | null>(null);
  const [audioRecordedTime, setAudioRecordedTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isPaused, setIsPaused] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const uploadedImageFiles = useCallback(() => {
    const flattenedData: DesignFile[] = [];
    if (activeEpic?.designFiles) {
      activeEpic.designFiles.forEach((parent) => {
        flattenedData.push(parent);
        parent.subFiles?.forEach((subFile) => flattenedData.push(subFile));
      });
    }
    setUploadedImages(flattenedData);
  }, [activeEpic]);

  useEffect(() => {
    if (activeEpic?.designFiles?.length && !uploadedImages?.length) {
      uploadedImageFiles();
    }
    const {
      backendLogicAudioS3ObjectKey,
      backendLogicAudioTranscription,
      backendLogicAudioRecordedTime,
    } = activeEpic || {};

    if (backendLogicAudioS3ObjectKey && !audioUrl?.startsWith('blob:')) {
      setAudioUrl(
        `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/${backendLogicAudioS3ObjectKey}`,
      );
    }
    if (backendLogicAudioTranscription) {
      setAudioTranscription(backendLogicAudioTranscription);
    }

    if (backendLogicAudioRecordedTime) {
      setAudioRecordedTime(+backendLogicAudioRecordedTime);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEpic, uploadedImages]);

  useEffect(() => {
    if (selectedMicId && !isRecording) {
      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMicId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBackendLogics(e.target.value);
  };

  const startRecording = () => {
    if (!selectedMicId) {
      return;
    }

    deleteExistingMediaRecorderedData();
    setIsRecording(true);
    setShowSlideshow(true);
    toast.success('Recording started, your voice is now being recorded.', {
      position: 'top-center',
    });

    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: selectedMicId } })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        recorder.onstop = handleRecordingStop;
        recorder.start();
        timerIdRef.current = setInterval(
          () => setRecordingTime((prev) => prev + 1),
          1000,
        );
      })
      .catch((err) =>
        toast.error(`Error accessing microphone: ${err.message}`),
      );
  };
  const handleDelete = async () => {
    const result = (await NiceModal.show(DeleteBackendLogicAudioDialog, {
      projectId: activeProject.id,
      epicId: activeEpic.id,
      organization: organization,
    })) as { success: boolean };

    if (result.success) {
      deleteExistingMediaRecorderedData();
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setSelectedMicId(null);
    }
  };
  async function fetchAudioAsBlob(audioUrl: string) {
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error('Failed to fetch audio.');
    const blob = await response.blob();
    return blob;
  }

  function joinBlobs(blob1: Blob, blob2: Blob, mimeType = 'audio/webm') {
    return new Blob([blob1, blob2], { type: mimeType });
  }
  const stopRecording = async () => {
    if (audioLoading) return;
    const recorder = mediaRecorderRef.current;
    const formData = new FormData();
    if (recorder) {
      const stoppedBlob = await new Promise<Blob>((resolve) => {
        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) resolve(event.data);
        };
        recorder.stop();
      });
      formData.append('audio', stoppedBlob, 'audio.webm');
      let blob = stoppedBlob;
      if (activeEpic?.backendLogicAudioS3ObjectKey) {
        const blob1 = await fetchAudioAsBlob(
          `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/${activeEpic.backendLogicAudioS3ObjectKey}`,
        );
        blob = joinBlobs(blob1, stoppedBlob);
      }
      formData.append('totalAudio', blob, 'audio.webm');
      const blobUrl = URL.createObjectURL(blob);
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(blobUrl);
    }

    setAudioLoading(true);
    formData.append('projectId', activeProject.id);
    formData.append('epicId', activeEpic.id);
    formData.append('audioRecordedTime', String(recordingTime));
    formData.append('langCode', selectedLanguage);

    const response = await fetch(apiRoutes.projects.epics.backendLogics, {
      method: 'POST',
      headers: { 'x-organization-slug': organization.slug },
      body: formData,
    });

    const data = await response.json();
    if (data?.serverError) {
      setIsPaused(false);
      setIsRecording(false);
      setShowSlideshow(false);
      setAudioLoading(false);
      toast.error('Audio recording failed, Please try again');
      handleDelete();
      return;
    }
    localStorage.setItem('backendLogicAudioTranscription', 'Done');
    setAudioTranscription(data.audioTranscription);
    router.refresh();
    setTimeout(() => {
      setIsRecording(false);
      setIsPaused(false);
      setShowSlideshow(false);
      setAudioLoading(false);
      toast.success(`Recording saved (${formatTime(recordingTime)})`);
    }, 1000);
  };

  const handleRecordingStop = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    setAudioBlob(audioBlob);

    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const deleteExistingMediaRecorderedData = () => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Failed to stop previous recorder:', err);
      }
      mediaRecorderRef.current = null;
    }
    audioChunksRef.current = [];
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };
  const handlePlaybackEnded = () => {
    setIsPlaying(false);
  };

  const toggleMicrophone = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setIsMicSelectOpen(true);
      setSelectedMicId(null);
    }
    setSelectedMicId(null);
  };

  const handleMicSelect = (deviceId: string) => {
    setSelectedMicId(deviceId);
    setIsMicSelectOpen(false);
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
  };
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handlePrevious = () => router.push(stepUrls.describeScreensUrl);

  const setAutoGenerateTimestamp = () => {
    sessionStorage.setItem(
      StorageKeys.AUTO_GENERATE_APP_FLOW_BEFORE,
      String(Date.now() + 10000),
    );
  };

  const handleNext = async () => {
    if (loading) return;
    setLoading(true);
    const newAudioTranscriptionStatus = localStorage.getItem(
      'backendLogicAudioTranscription',
    );
    if (
      (!audioTranscription ||
        activeEpic?.backendLogicAudioTranscription == audioTranscription) &&
      !backendLogics &&
      stepsCompleted >= 2.1 &&
      newAudioTranscriptionStatus !== 'Done'
    ) {
      if (stepsCompleted === 2.1) setAutoGenerateTimestamp();
      router.push(stepUrls.appFlowUrl);
      return setLoading(false);
    }

    if (stepsCompleted > 2.1) {
      router.push(stepUrls.appFlowUrl);
      return setLoading(false);
    }

    if (isRecording) await stopRecording();

    const formData = new FormData();
    if (backendLogics) formData.append('text', backendLogics);
    if (audioTranscription) {
      formData.append('text', audioTranscription);
    }
    formData.append('projectId', activeProject.id);
    formData.append('epicId', activeEpic.id);

    TogglePointerEvents({
      pointerEventEnable: true,
      enableSpecificDataAttribute: 'backend-logics-step',
    });

    const response = await fetch(apiRoutes.projects.epics.backendLogics, {
      method: 'POST',
      headers: { 'x-organization-slug': organization.slug },
      body: formData,
    });

    const data = await response.json();
    setLoading(false);

    if ((audioBlob || backendLogics) && data?.serverError) {
      TogglePointerEvents({ pointerEventEnable: false });
      return toast.error('Server error, please try again');
    }
    localStorage.removeItem('backendLogicAudioTranscription');
    setAudioBlob(null);
    setRecordingTime(0);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setBackendLogics('');
    TogglePointerEvents({ pointerEventEnable: false });

    router.refresh();
    setTimeout(() => {
      setAutoGenerateTimestamp();
      router.push(stepUrls.appFlowUrl);
    }, 500);
  };

  const handleEditedTranscription = (editedTranscription: string) => {
    setAudioTranscription(editedTranscription);
  };

  const pauseRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      recorder.pause();
      clearInterval(timerIdRef.current!);
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'paused') {
      recorder.resume();
      timerIdRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setIsPaused(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 mx-auto">
      <h1 className="mb-2 text-2xl font-semibold">Backend Logics (optional)</h1>
      <p className="mb-8 text-muted-foreground flex items-center">
        Describe any backend requirements for your app that were not visible in
        the UI screens.
        <CustomTooltip
          content={`The backend logic feature will be disabled once the app flow is generated. Please ensure all backend requirements are captured before proceeding.`}
        >
          <span className="ml-2 text-black">
            <InfoIcon className="w-4 h-4" />
          </span>
        </CustomTooltip>
      </p>

      <MicSelectionModal
        isOpen={isMicSelectOpen}
        onClose={() => setIsMicSelectOpen(false)}
        onMicSelect={handleMicSelect}
        onLanguageSelect={handleLanguageSelect}
      />
      <SlideshowOverlay
        show={showSlideshow}
        isRecording={isRecording}
        uploadedImages={uploadedImages}
        recordingTime={recordingTime}
        stopRecording={stopRecording}
        audioLoading={audioLoading}
        formatTime={formatTime}
        pauseRecording={pauseRecording}
        resumeRecording={resumeRecording}
        isPaused={isPaused}
      />

      <Tabs defaultValue="record" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="record">
            Record Explanation
            {audioTranscription && (
              <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-white bg-green-600 rounded-full">
                <CheckIcon className="size-3 text-white" />
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="text">
            Text Input
            {backendLogics && backendLogics.trim() !== '' && (
              <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-white bg-green-600 rounded-full">
                <CheckIcon className="size-3 text-white" />
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="space-y-6">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="mb-4 text-lg font-medium">Record Voice</h3>
            <p className="mb-4 text-muted-foreground">
              Your voice will be captured while a slideshow of screens is
              displayed.
            </p>

            <RecordingControls
              isRecording={isRecording}
              audioUrl={audioUrl}
              isPlaying={isPlaying}
              toggleMicrophone={toggleMicrophone}
              handlePlayPause={handlePlayPause}
              handleDelete={handleDelete}
              loading={loading}
              audioRecordedTime={audioRecordedTime}
              handlePlaybackEnded={handlePlaybackEnded}
              stepsCompleted={stepsCompleted}
            />

            {isRecording && (
              <div className="p-4 mt-4 border border-dashed rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Voice recording is active. Explain your backend requirements
                  clearly.
                </p>
              </div>
            )}

            {audioTranscription && (
              <VoiceTranscriptionEditor
                markdown={audioTranscription}
                onTranscriptionChange={handleEditedTranscription}
                stepsCompleted={stepsCompleted}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="mb-4 text-lg font-medium">Text Description</h3>
            <p className="mb-4 text-muted-foreground">
              Include details about APIs, data logic, user roles, etc.
            </p>
            <TextInputEditor
              value={backendLogics}
              onChange={handleTextChange}
            />
          </div>
        </TabsContent>
      </Tabs>

      <StepNavigationControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        loading={loading}
      />
    </div>
  );
}
