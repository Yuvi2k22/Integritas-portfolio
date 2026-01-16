import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { apiRoutes } from '@workspace/routes';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import { toast } from '@workspace/ui/components/sonner';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';
import { useRouter } from 'next/navigation';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export type DeleteBackendLogicAudioDialogProps = {
  epicId: string;
  projectId: string;
  organization: {
    slug: string;
  };
} & NiceModalHocProps;

export const DeleteBackendLogicAudioDialog =
  NiceModal.create<DeleteBackendLogicAudioDialogProps>((props) => {
    const { epicId, projectId, organization } = props;
    const modal = useEnhancedModal();
    const router = useRouter();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

    const handleDeleteBackendLogicAudio = async () => {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('epicId', epicId);
      const response = await fetch(
        `${apiRoutes.projects.epics.backendLogics}/delete-audio`,
        {
          method: 'POST',
          headers: { 'x-organization-slug': organization.slug },
          body: formData,
        },
      );
      const result = await response.json();
      if (!result?.serverError && !result?.validationErrors) {
        router.refresh();
        toast.success('Audio deleted successfully');
        modal.resolve({ success: true, deleted: true });
        modal.handleClose();
      } else {
        modal.resolve({ success: false, error: result });
        toast.error("Can't delete audio");
      }
    };

    const title = 'Delete Audio';
    const renderDescription = (
      <>
        You're about to delete backend logic audio, This action cannot be
        undone.
      </>
    );

    const renderButtons = (
      <>
        <Button type="button" variant="outline" onClick={modal.handleClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteBackendLogicAudio}
        >
          Yes, delete
        </Button>
      </>
    );

    return mdUp ? (
      <AlertDialog open={modal.visible}>
        <AlertDialogContent
          onClose={modal.handleClose}
          onAnimationEndCapture={modal.handleAnimationEndCapture}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{renderDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>{renderButtons}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <Drawer open={modal.visible} onOpenChange={modal.handleOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{renderDescription}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex-col-reverse pt-4">
            {renderButtons}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  });
