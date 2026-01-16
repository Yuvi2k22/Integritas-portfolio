import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
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

import { deleteEpic } from '~/actions/epics/delete-epic';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { EpicDto } from '~/types/dtos/epic-dto';
import { ProjectDto } from '~/types/dtos/project-dto';

export type DeleteEpicDialogProps = {
  epic: EpicDto;
  project: ProjectDto;
} & NiceModalHocProps;

export const DeleteEpicDialog = NiceModal.create<DeleteEpicDialogProps>(
  (props) => {
    const { epic, project } = props;
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

    const handleDeleteEpic = async () => {
      if (!epic || !project) return;

      const result = await deleteEpic({
        epicId: epic.id,
        projectId: project.id
      });

      if (!result?.serverError && !result?.validationErrors) {
        toast.success('Epic deleted successfully');
        modal.handleClose();
      } else {
        toast.error("Can't delete Epic");
      }
    };

    const title = 'Delete Project';
    const renderDescription = (
      <>
        You're about to delete{' '}
        <strong className="text-foreground font-bold">{epic?.name}</strong> from{' '}
        <strong className="text-foreground font-bold">{project?.name}</strong>.{' '}
        This action cannot be undone.
      </>
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
          variant="destructive"
          onClick={handleDeleteEpic}
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
      <Drawer
        open={modal.visible}
        onOpenChange={modal.handleOpenChange}
      >
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
  }
);
