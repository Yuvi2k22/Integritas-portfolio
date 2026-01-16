// components/backend-logics/MicSelectionModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MicAndLanguageSelectDialog } from './mic-language-select-dialog';
import { toast } from '@workspace/ui/components/sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onMicSelect: (deviceId: string) => void;
  onLanguageSelect: (langCode: string) => void;
}

export function MicSelectionModal({
  isOpen,
  onClose,
  onMicSelect,
  onLanguageSelect,
}: Props) {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);

  const micErrorHandle = (error: string) => {
    toast.error(error);
    onClose();
  };

  useEffect(() => {
    const fetchMicrophones = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((device) => device.kind === 'audioinput');
        if (mics?.length > 0 && mics?.[0]?.deviceId) {
          setMicrophones(mics);
        } else {
          micErrorHandle(
            'Microphone access denied. Please allow permission in your browser settings.',
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          micErrorHandle(
            'Microphone access denied. Please allow permission in your browser settings.',
          );
        } else {
          micErrorHandle(`Error accessing microphone: ${err.message}`);
        }
      }
    };

    if (isOpen) {
      fetchMicrophones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return isOpen && microphones?.length > 0 && microphones?.[0]?.deviceId ? (
    <MicAndLanguageSelectDialog
      isOpen={isOpen}
      onClose={onClose}
      onMicSelect={onMicSelect}
      onLanguageSelect={onLanguageSelect}
      microphones={microphones}
    />
  ) : null;
}
