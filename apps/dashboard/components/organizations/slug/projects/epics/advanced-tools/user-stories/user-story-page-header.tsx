/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { ChevronDownIcon, Loader, PlusIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { TogglePointerEvents } from '@workspace/ui/components/pointer-control';

import { generateStoryDetails } from '~/actions/user-stories/generate-story-details';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveProject } from '~/hooks/use-active-project';
import { NotionIntegrationDialog } from './notion-integration/authorize-notion-dialog';
import { CreateUserStoryDialog } from './upsert-user-story-dialog';
import { useActiveNotion } from '~/hooks/use-active-notion';
import { NotionExportDialog } from './notion-integration/notion-export/notion-export-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';

export function UserStoryPageHeader({
  acceptanceCrieriaGenerate,
  notionExportEnable,
}: {
  acceptanceCrieriaGenerate: number;
  notionExportEnable: number;
}) {
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();
  const activeNotion = useActiveNotion();
  const handleAddUserStory = () =>
    NiceModal.show(CreateUserStoryDialog, {
      projectId: activeProject.id,
      epicId: activeEpic.id,
    });
  useEffect(() => {
    const shouldEnable = acceptanceCrieriaGenerate > 0;

    TogglePointerEvents({
      pointerEventEnable: shouldEnable,
      disableSpecificDataAttribute: shouldEnable
        ? 'user-story-disable'
        : undefined,
      enableSpecificDataAttribute: shouldEnable
        ? undefined
        : 'user-story-disable',
    });

    if (shouldEnable) {
      generateStoryDetails({
        projectId: activeProject.id,
        epicId: activeEpic.id,
      });
    }
  }, [acceptanceCrieriaGenerate]);

  const showNotionIntegrationDialog = ({
    re_auth = false,
    editNotionDB = false,
  }: {
    re_auth?: boolean;
    editNotionDB?: boolean;
  }) => {
    NiceModal.show(NotionIntegrationDialog, {
      projectId: activeProject.id,
      epicId: activeEpic.id,
      notionData: re_auth ? null : activeNotion,
      ...(editNotionDB && { editNotionDB }),
    });
  };
  const openNotionIntegrationDialog = (re_auth?: boolean) => {
    showNotionIntegrationDialog({ re_auth });
  };

  const openEditNotionDatabaseDialog = () => {
    showNotionIntegrationDialog({ editNotionDB: true });
  };
  const openNotionExportDialog = () => {
    NiceModal.show(NotionExportDialog, {
      projectId: activeProject.id,
      epicId: activeEpic.id,
    });
  };

  const handleNotionIntegrate = async () => {
    const data = activeNotion?.data?.[0];
    if (data) {
      if (data?.notionProjectDB?.length === 0) {
        openNotionIntegrationDialog();
      } else {
        openNotionExportDialog();
      }
    } else {
      openNotionIntegrationDialog();
    }
  };
  return (
    <section id="projects-page-header" className="my-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Stories</h1>
        <div className="flex gap-2">
          {acceptanceCrieriaGenerate > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted/50 animate-pulse whitespace-nowrap min-w-[280px]">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating acceptance criteria...</span>
            </div>
          )}

          <Button className="w-full gap-2 text-sm" onClick={handleAddUserStory}>
            <PlusIcon className="w-4 h-4" />
            Add Story
          </Button>
          <div className="flex w-full max-w-xs">
            <Button
              className={`w-40 text-sm ${activeNotion?.data?.[0]?.auth_token ? 'rounded-r-none' : ''}`}
              onClick={handleNotionIntegrate}
              disabled={!notionExportEnable}
            >
              {activeNotion?.data?.[0]?.auth_token &&
              activeNotion?.data?.[0]?.notionProjectDB &&
              activeNotion?.data?.[0]?.notionProjectDB?.length > 0
                ? `Export to Notion`
                : `Connect to Notion`}
            </Button>
            {activeNotion?.data?.[0]?.auth_token && (
              <>
                <div className="z-50 self-center w-px h-8 bg-white dark:bg-black" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-8 px-2 rounded-l-none">
                      <ChevronDownIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => openNotionIntegrationDialog(true)}
                    >
                      Re-authenticate
                    </DropdownMenuItem>
                    {activeNotion.data[0]?.notionProjectDB &&
                      activeNotion?.data[0].notionProjectDB?.length > 0 && (
                        <DropdownMenuItem
                          onClick={() => openEditNotionDatabaseDialog()}
                        >
                          Edit Notion Database
                        </DropdownMenuItem>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
