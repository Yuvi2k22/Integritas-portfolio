'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Play, Pause, Trash, Download } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

interface Props {
  isRecording: boolean;
  audioUrl: string | null;
  isPlaying: boolean;
  toggleMicrophone: () => void;
  handlePlayPause: () => void;
  handlePlaybackEnded: () => void;
  handleDelete: () => void;
  loading: boolean;
  audioRecordedTime: number;
  stepsCompleted?: number;
}

export function RecordingControls({
  isRecording,
  audioUrl,
  isPlaying,
  toggleMicrophone,
  handlePlayPause,
  handlePlaybackEnded,
  handleDelete,
  loading,
  audioRecordedTime,
  stepsCompleted = 0,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Set duration from props
  useEffect(() => {
    if (audioRecordedTime > 0) {
      setDuration(audioRecordedTime);
    }
  }, [audioRecordedTime]);

  // Handle playback based on isPlaying state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const play = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.error('Playback error:', err);
      }
    };

    if (isPlaying && audio.paused) {
      play();
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  // Track progress, duration, and handle end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleMetadata = () => {
      if (!audioRecordedTime) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setProgress(Math.floor(audio.currentTime));
    };

    const handleEnded = () => {
      setProgress(0);
      handlePlaybackEnded(); // 🔥 Important: update play state
    };

    audio.addEventListener('loadedmetadata', handleMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, audioRecordedTime, handlePlaybackEnded]);

  // Seek handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  // Format time as mm:ss
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleDownload = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'recording.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row items-start w-full">
      <Button
        variant={isRecording ? 'destructive' : 'default'}
        className="flex items-center gap-2"
        onClick={toggleMicrophone}
        disabled={loading || stepsCompleted > 2.1}
      >
        {isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        {isRecording
          ? 'Stop Recording'
          : audioUrl
            ? 'Continue Recording'
            : 'Start Recording'}
      </Button>

      {audioUrl && (
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
          {/* Hidden audio element */}
          <audio ref={audioRef} src={audioUrl} hidden />

          <Button variant="ghost" onClick={handlePlayPause} className="p-2">
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <div className="flex items-center gap-2 w-full">
            <span className="text-sm tabular-nums text-muted-foreground">
              {formatTime(progress)}
            </span>

            <input
              type="range"
              min={0}
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="w-full accent-blue-500"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercent}%, #d1d5db ${progressPercent}%, #d1d5db 100%)`,
              }}
            />

            <span className="text-sm tabular-nums text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>

          <Button
            variant="ghost"
            onClick={handleDelete}
            className="p-2 text-red-500"
          >
            <Trash className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleDownload}
            className="p-2"
            disabled={!audioUrl}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
