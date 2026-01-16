// components/backend-logics/SlideshowOverlay.tsx
'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@workspace/ui/components/carousel';
import { Loader, Pause, Play } from 'lucide-react';
export interface DesignFile {
  id: string;
  filename: string;
  description: string;
  accessUrl: string;
}
interface Props {
  show: boolean;
  isRecording: boolean;
  uploadedImages: DesignFile[];
  recordingTime: number;
  stopRecording: () => void;
  audioLoading: boolean;
  formatTime: (s: number) => string;
  pauseRecording: () => void;
  resumeRecording: () => void;
  isPaused: boolean;
}

export function SlideshowOverlay({
  show,
  isRecording,
  uploadedImages,
  recordingTime,
  stopRecording,
  audioLoading,
  formatTime,
  isPaused,
  pauseRecording,
  resumeRecording,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col p-8 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Screen Images</h2>
        <div className="flex items-center gap-4">
          {isRecording && (
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-full border border-red-200 dark:border-red-800">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg"></div>
              <span className="text-sm font-mono font-medium text-red-700 dark:text-red-300">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}

          {isRecording && (
            <Button
              variant="secondary"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="w-28"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={stopRecording} className="w-40">
            {audioLoading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Stop Recording'
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center flex-1">
        <Carousel className="w-full max-w-4xl">
          <div className="sticky top-0 bg-background/95 text-center z-10">
            <p className="text-lg font-semibold text-foreground">
              🎙️ Start speaking and explain the logic behind each screen.
            </p>
          </div>
          <CarouselContent>
            {uploadedImages.map((image) => (
              <CarouselItem key={image.id}>
                <div className="p-1">
                  <div className="flex justify-center items-center mb-2">
                    <h3 className="mt-4 text-lg font-medium">
                      {image.filename}
                    </h3>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-muted/20 rounded-lg p-2 w-full flex items-center justify-center h-[60vh]">
                      <img
                        src={image.accessUrl}
                        alt={image.filename}
                        className="object-contain max-h-full"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {uploadedImages.length > 1 && (
            <>
              <div className="mt-6 text-sm text-center text-muted-foreground">
                Scroll through the images and describe how each step or feature
                works.
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <CarouselPrevious className="static translate-x-0 translate-y-0" />
                <CarouselNext className="static translate-x-0 translate-y-0" />
              </div>
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}
