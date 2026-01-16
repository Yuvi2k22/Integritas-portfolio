'use client';

import { useEffect, useState } from 'react';
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { ExternalLink, Loader } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import { toast } from '@workspace/ui/components/sonner';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { addNotion } from '~/actions/notion/add-notion';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { NotionIntegration } from '~/types/dtos/notion-integration-dto';
import { SelectNotionDatabasesDialog } from './notion-database-select-dialog';
import { getNotionDatabase } from '~/actions/notion/get-database-from-notion';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';

export type NotionIntegrationDialogProps = NiceModalHocProps & {
  projectId: string;
  epicId: string;
  notionData: NotionIntegration | null;
  editNotionDB: boolean;
};
export const NotionIntegrationDialog =
  NiceModal.create<NotionIntegrationDialogProps>((props) => {
    const { projectId, epicId, notionData, editNotionDB = false } = props;
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const [isLoading, setIsLoading] = useState(false);
    const titleText = `Notion Integration`;
    const descriptionText = `Integrate notion with Integritas click the button below`;

    const notionIntegrationStatus = (failed?: boolean) => {
      window.localStorage.removeItem('notionCode');
      if (failed) {
        toast.error(
          'Notion integration failed!, Try again',
          userStoryToastPosition,
        );
      }
      setIsLoading(false);
      modal.handleClose();
    };

    const openNotionDBDialog = async () => {
      window.localStorage.removeItem('notionCode');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !isLoading && setIsLoading(true);
      const result = await getNotionDatabase({ projectId });
      if (
        !result?.data?.serverError &&
        result &&
        !result?.data?.validationErrors
      ) {
        NiceModal.show(SelectNotionDatabasesDialog, {
          databases: result.data,
          projectId,
          epicId,
        });
        notionIntegrationStatus(false);
      } else {
        notionIntegrationStatus(true);
      }
    };
    useEffect(() => {
      if (
        editNotionDB ||
        (notionData?.data?.[0]?.notionProjectDB?.length === 0 &&
          notionData?.data?.[0]?.auth_token)
      ) {
        openNotionDBDialog();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notionData]);
    const waitForCode = (interval = 200) => {
      return new Promise((resolve) => {
        const check = () => {
          const code = window.localStorage.getItem('notionCode');
          if (code) {
            resolve(code);
          } else {
            setTimeout(check, interval);
          }
        };

        check();
      });
    };

    const initiateNotionIntegrate = async () => {
      try {
        setIsLoading(true);
        const hostUrl = window.location.origin;
        const redirect_uri = encodeURIComponent(
          `${hostUrl}/api/integration/notion`,
        );
        const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
        const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code`;
        window.open(notionAuthUrl, '_blank');
        const code = await waitForCode();
        if (code == 'null') {
          notionIntegrationStatus(true);
        } else {
          const result = await addNotion({
            projectId,
            epicId,
            code: code as string,
            redirect_uri,
          });
          if (result?.serverError || result?.validationErrors) {
            notionIntegrationStatus(true);
          } else {
            openNotionDBDialog();
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        notionIntegrationStatus(true);
      }
    };
    const renderForm = (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Allow access to your Notion workspace by clicking the button below:
        </p>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={initiateNotionIntegrate}
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect to Notion
            </>
          )}
        </Button>
        <div className="p-3 border rounded-md bg-amber-50 border-amber-200">
          <p className="text-xs text-amber-700">
            <strong>Note:</strong> You'll be redirected to Notion to authorize.
            After authorizing, you'll be automatically returned to complete the
            connection.
          </p>
        </div>
      </div>
    );

    return (
      <>
        {mdUp ? (
          <Dialog open={modal.visible}>
            <DialogContent
              className="sm:max-w-[500px]"
              onClose={modal.handleClose}
              onAnimationEndCapture={modal.handleAnimationEndCapture}
            >
              <DialogHeader>
                <DialogTitle>{titleText}</DialogTitle>
                <DialogDescription className="sr-only">
                  {descriptionText}
                </DialogDescription>
              </DialogHeader>
              {renderForm}
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={modal.visible} onOpenChange={modal.handleOpenChange}>
            <DrawerContent>
              <DrawerHeader className="text-left ">
                <DrawerTitle>{titleText}</DrawerTitle>
                <DrawerDescription className="sr-only">
                  {descriptionText}
                </DrawerDescription>
              </DrawerHeader>
              <div>{renderForm}</div>
            </DrawerContent>
          </Drawer>
        )}
      </>
    );
  });
