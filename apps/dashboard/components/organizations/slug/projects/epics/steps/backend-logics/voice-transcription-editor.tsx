// components/backend-logics/VoiceTranscriptionEditor.tsx
'use client';
import { TranscriptionResult } from './transcription-display';

interface Props {
  markdown: string;
  onTranscriptionChange: (editedTranscription: string) => void;
  stepsCompleted?: number;
}

export function VoiceTranscriptionEditor({
  markdown,
  onTranscriptionChange,
  stepsCompleted,
}: Props) {
  return (
    <div className=" pt-4">
      <TranscriptionResult
        transcription={markdown}
        onTranscriptionChange={onTranscriptionChange}
        stepsCompleted={stepsCompleted}
      />
    </div>
  );
}
