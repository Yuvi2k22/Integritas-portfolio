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
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export type EpicLimitReachedDialogProps = NiceModalHocProps & {
  message?: string;
};

export const EpicLimitReachedDialog =
  NiceModal.create<EpicLimitReachedDialogProps>(({ message }) => {
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

    const title = 'Generation Limit Reached';
    const descriptionElement = (
      <>
        You have reached your{' '}
        <strong className="font-bold text-foreground">
          feature generation limit
        </strong>{' '}
        for this month.
        {message
          ? ` ${message}`
          : ' Please wait until next month to generate more content.'}
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
          <AlertDialogFooter>
            <Button type="button" variant="default" onClick={modal.handleClose}>
              Close
            </Button>
          </AlertDialogFooter>
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
            <Button type="button" variant="default" onClick={modal.handleClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  });
