import NiceModal from '@ebay/nice-modal-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@workspace/ui/components/drawer';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export const CreateToolModal = NiceModal.create(() => {
  const modal = useEnhancedModal();
  const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

  const title = 'Create Custom Tools';

  return mdUp ? (
    <Dialog
      open={modal.visible}
      onOpenChange={modal.handleOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
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
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
});
