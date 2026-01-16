import NiceModal from '@ebay/nice-modal-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';

import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export const CreateToolDialog = NiceModal.create(() => {
  const modal = useEnhancedModal();
  return (
    <Dialog
      open={modal.visible}
      onOpenChange={modal.handleOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Custom Tools</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});
