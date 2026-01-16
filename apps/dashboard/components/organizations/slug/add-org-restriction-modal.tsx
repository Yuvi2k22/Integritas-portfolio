import NiceModal from '@ebay/nice-modal-react';

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
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export const AddOrgRestrictionModal = NiceModal.create(() => {
  const modal = useEnhancedModal();
  const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

  const title = 'Organization Limit Reached';
  const descriptionElement = (
    <>
      You already own{' '}
      <strong className="font-bold text-foreground">
        one free organization{' '}
      </strong>
      . Each user can only own one free org. To create a new organization,
      please upgrade to a paid plan or transfer ownership of your existing free
      org.
    </>
  );

  const renderButtons = (
    <>
      <Button
        type="button"
        variant="default"
        onClick={modal.handleClose}
        className="w-36"
      >
        Ok
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
          <AlertDialogDescription>{descriptionElement}</AlertDialogDescription>
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
          <DrawerDescription>{descriptionElement}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex-col-reverse pt-4">
          {renderButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
