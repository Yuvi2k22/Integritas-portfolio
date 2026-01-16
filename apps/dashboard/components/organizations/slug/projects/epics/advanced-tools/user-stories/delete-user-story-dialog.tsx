import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';

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

import { deleteUserStory } from '~/actions/user-stories/delete-user-story';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export type DeleteUserStoryDialogProps = NiceModalHocProps & {
  projectId: string;
  epicId: string;
  userStoryId: string;
  userStoryName?: string;
};

export const DeleteUserStoryDialog =
  NiceModal.create<DeleteUserStoryDialogProps>((props) => {
    const { projectId, epicId, userStoryId, userStoryName } = props;
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

    const handleDeleteUserStory = async () => {
      if (!projectId || !epicId || !userStoryId) return;

      // Call the delete action with the corresponding IDs.
      const result = await deleteUserStory({
        userStoryId,
        projectId,
        epicId,
      });

      if (!result?.serverError && !result?.validationErrors) {
        toast.success(
          'User story deleted successfully',
          userStoryToastPosition,
        );
        modal.handleClose();
      } else {
        toast.error("Can't delete user story", userStoryToastPosition);
      }
    };

    const title = 'Delete User Story';
    const descriptionElement = (
      <>
        You're about to delete{' '}
        {userStoryName ? (
          <strong className="font-bold text-foreground">{userStoryName}</strong>
        ) : (
          <strong className="font-bold text-foreground">this user story</strong>
        )}
        . This action cannot be undone.
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
          onClick={handleDeleteUserStory}
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
            <AlertDialogDescription>
              {descriptionElement}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>{renderButtons}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <Drawer open={modal.visible} onOpenChange={modal.handleOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{descriptionElement}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex-col-reverse pt-4">
            {renderButtons}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  });
