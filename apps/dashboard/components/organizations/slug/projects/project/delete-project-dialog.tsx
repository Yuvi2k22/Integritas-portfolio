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

import { deleteProject } from '~/actions/projects/delete-project';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { ProjectDto } from '~/types/dtos/project-dto';

export type DeleteProjectDialogProps = NiceModalHocProps & {
  project?: ProjectDto;
};

export const DeleteProjectDialog = NiceModal.create<DeleteProjectDialogProps>(
  (props) => {
    const { project } = props;
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

    const handleDeleteProject = async () => {
      if (!project) return;

      const result = await deleteProject({ projectId: project.id });

      if (!result?.serverError && !result?.validationErrors) {
        toast.success('Project deleted successfully');
        modal.handleClose();
      } else {
        toast.error("Can't delete project");
      }
    };

    const title = 'Delete Project';
    const renderDescription = (
      <>
        You're about to delete{' '}
        <strong className="text-foreground font-bold">{project?.name}</strong>.
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
          onClick={handleDeleteProject}
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
