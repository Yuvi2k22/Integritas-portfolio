'use client';

import { useEffect, useRef, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { Editor } from '@tiptap/react';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@workspace/ui/components/drawer';
import { toast } from '@workspace/ui/components/sonner';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { MarkdownEditor } from '~/components/editor/markdown-editor';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { EpicDto } from '~/types/dtos/epic-dto';

export const ExportPdfModal = NiceModal.create<{ epic: EpicDto }>((props) => {
  const { epic } = props;

  const modal = useEnhancedModal();
  const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
  const editorRef = useRef<Editor>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editorContent, setEditorContent] = useState<string>('');

  const title = 'Export Screen Docs to PDF';
  const description = 'Export screen docs to pdf';

  const handleExportPdf = async () => {
    if (!editorContainerRef.current) return;

    var wnd = window.open('about:blank', '', '_blank');
    if (wnd) {
      wnd.document.write(`
        <style>
          img {
            max-width: 500px;
            max-height: 500px;
            display: block;
          }
        </style>
      `);
      wnd.document.write(editorContainerRef.current.innerHTML);
      wnd.print();
      wnd.close();
    } else {
      // Show user notification that popup was blocked
      toast.error('Please allow popups for PDF export functionality');
    }
  };

  const renderPdfView = (
    <div
      ref={editorContainerRef}
      className="editor-container max-h-[70vh] overflow-auto"
    >
      <MarkdownEditor
        onEditorInit={(editor) => (editorRef.current = editor)}
        markdownContent={editorContent}
        readOnly
        hideToolbar
      />
    </div>
  );

  const renderButtons = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={modal.handleClose}
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="default"
        onClick={handleExportPdf}
      >
        Export
      </Button>
    </>
  );

  useEffect(() => {
    if (epic) {
      let pdfContent = `# App Flow: \n`;
      pdfContent += `${epic.epicFlowDoc}\n\n`;
      pdfContent += '# Screenwise Docs:\n';
      epic.designFiles?.forEach((mainFile, index) => {
        pdfContent += `### Screen - ${index + 1}:\n`;
        pdfContent += `\n![${mainFile.filename}](${encodeURI(mainFile.accessUrl)}) \n`;
        pdfContent += `${mainFile.designFlowDoc}\n`;
        mainFile.subFiles?.forEach((subFile, subIndex) => {
          pdfContent += `### Screen - ${index + 1}.${subIndex + 1}:\n`;
          pdfContent += `\n![${subFile.filename}](${encodeURI(subFile.accessUrl)}) \n`;
          pdfContent += `${subFile.designFlowDoc}\n`;
        });
      });
      setEditorContent(pdfContent);
    }
  }, [epic]);

  return mdUp ? (
    <Dialog open={modal.visible}>
      <DialogContent
        className="max-w-3xl"
        onClose={modal.handleClose}
        onAnimationEndCapture={modal.handleAnimationEndCapture}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        {renderPdfView}
        <DialogFooter>{renderButtons}</DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={modal.visible}
      onOpenChange={modal.handleOpenChange}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        {renderPdfView}
        <DrawerFooter className="flex-col-reverse pt-4">
          {renderButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
