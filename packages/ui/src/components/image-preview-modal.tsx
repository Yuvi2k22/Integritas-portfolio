import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Loader2, X } from 'lucide-react';

export interface ImagePreviewProps {
  src?: string;
  alt?: string;
  thumbnailClassName?: string;
  previewClassName?: string;
  children?: React.ReactNode;
}

export const ImagePreview = ({
  src: propSrc,
  alt: propAlt = '',
  thumbnailClassName = '',
  previewClassName = '',
  children
}: ImagePreviewProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If a child is provided and it's an image, extract its attributes.
  let src = propSrc;
  let alt = propAlt;
  let thumbClassName = thumbnailClassName;
  const CloseButton = (
    <Dialog.Close asChild>
      <button
        className={`absolute ${hasError ? 'right-[-465] top-[-10]' : 'top-[-10px] right-[-10px]'} p-1 text-white transition-colors bg-red-600 rounded-sm hover:bg-red-800`}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </Dialog.Close>
  );
  if (children && React.isValidElement(children) && children.type === 'img') {
    // @ts-ignore
    src = children.props.src;
    // @ts-ignore
    alt = children.props.alt || propAlt;
    // @ts-ignore
    thumbClassName = children.props.className || thumbnailClassName;
  }

  // When dialog opens and we have a source, preload the image.
  useEffect(() => {
    if (!open || !src) return;

    setIsLoading(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
  }, [open, src]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger asChild>
        {children ? (
          children
        ) : (
          <img
            src={src}
            alt={alt}
            className={`cursor-pointer hover:opacity-90 transition-opacity ${thumbClassName}`}
          />
        )}
      </Dialog.Trigger>
      <Dialog.Title></Dialog.Title>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 focus:outline-none">
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-64">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            ) : hasError ? (
              <>
                <div className="flex flex-col items-center justify-center w-[400%] h-64 text-black bg-white ">
                  <div className="mb-2 text-red-500">
                    <AlertTriangle className="w-12 h-12" />
                  </div>
                  <p>Failed to load image</p>
                </div>
                {CloseButton}
              </>
            ) : (
              <>
                <img
                  src={src}
                  alt={alt}
                  className={`max-h-[90vh] max-w-[90vw] rounded ${previewClassName}`}
                  onLoad={() => setIsLoading(false)}
                />
                {CloseButton}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
