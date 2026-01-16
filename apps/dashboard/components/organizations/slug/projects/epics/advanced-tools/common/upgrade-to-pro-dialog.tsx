import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { replaceOrgSlug, routes } from '@workspace/routes';

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
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSessionRecording } from '~/app/posthog-provider';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export type UpgradeToProDialogProps = NiceModalHocProps & {
  message?: string;
  organizationName?: string;
  email?: string;
  organizationSlug?: string;
};

export type postHogRecording = {
  organizationName?: string;
  eventName: string;
  email?: string;
};

export const UpgradeToProDialog = NiceModal.create<UpgradeToProDialogProps>(
  ({
    message = '',
    organizationName = '',
    email = '',
    organizationSlug = '',
  }) => {
    const { startRecording } = useSessionRecording();
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    const handleUpgrade = async (): Promise<void> => {
      const data: postHogRecording = {
        organizationName,
        eventName: 'upgrade-event',
      };
      if (email) data.email = email;
      startRecording({
        ...data,
      });
      setLoader(true);
      const billingPageRouter = replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.Billing,
        organizationSlug,
      );
      router.push(billingPageRouter);
      setLoader(false);
      modal.handleClose();
    };

    const title = 'Upgrade to Pro';
    const descriptionElement = (
      <>
        You need a{' '}
        <strong className="font-bold text-foreground"> Pro account</strong> to
        {message ? ` ${message}` : 'regenerate content'}.
      </>
    );

    const renderButtons = (
      <>
        <Button type="button" variant="outline" onClick={modal.handleClose}>
          Not now
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleUpgrade}
          className="w-36"
        >
          {loader ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            'Upgrade to Pro'
          )}
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
  },
);
