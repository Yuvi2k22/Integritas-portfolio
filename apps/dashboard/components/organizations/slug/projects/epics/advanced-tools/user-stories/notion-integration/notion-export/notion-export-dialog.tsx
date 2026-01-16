'use client';

import { useEffect, useMemo, useState } from 'react';
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { ChevronDownIcon, Loader } from 'lucide-react';

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
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { exportToNotionDatabase } from '~/actions/notion/export-to-notion';
import { getNotionPageDetails } from '~/actions/notion/get-notion-database-page-details';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';

export type NotionExportDialogProps = NiceModalHocProps & {
  projectId: string;
  epicId: string;
};
export type Project = {
  id: string;
  name: string;
};
export const NotionExportDialog = NiceModal.create<NotionExportDialogProps>(
  (props) => {
    const { projectId, epicId } = props;
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const [isLoading, setIsLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [notionProjects, setNotionProjects] = useState<Project[]>([]);

    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const activeProject = useMemo(
      () => notionProjects.find((project) => project.id === selectedProject),
      [notionProjects, selectedProject],
    );
    const handleExport = async () => {
      setExportLoading(true);
      const result = await exportToNotionDatabase({
        projectId,
        epicId,
        notionProjectId: selectedProject,
      });
      if (result?.data) {
        toast.success('User stories exported', userStoryToastPosition);
      } else {
        toast.error(
          'Export user stories to notion failed, Try again...',
          userStoryToastPosition,
        );
      }
      modal.handleClose();
      setExportLoading(false);
    };

    const getNotionDatabase = async () => {
      const result = await getNotionPageDetails({ projectId, epicId });

      if (result?.data && result?.data?.length > 0) {
        setIsLoading(false);
        setNotionProjects(result.data);
      } else {
        toast.error(
          'Export user stories to notion failed, Try again...',
          userStoryToastPosition,
        );
        modal.handleClose();
      }
    };
    useEffect(() => {
      getNotionDatabase();
    }, []);
    const titleText = isLoading
      ? `Export to Notion`
      : 'Select Project to Export';
    const descriptionText = `Integritas user stories export`;
    const renderForm = (
      <div className="space-y-4">
        {isLoading ? (
          <>
            <p className="text-sm text-slate-500">
              Accessing your Notion workspace:
            </p>
            <Button className="w-full" disabled={isLoading}>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </Button>
          </>
        ) : (
          <div className="py-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Choose a project
              </label>
              <Popover
                open={projectDropdownOpen}
                onOpenChange={setProjectDropdownOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={projectDropdownOpen}
                    className="justify-between w-full"
                  >
                    {activeProject?.name || 'Select a project'}
                    <ChevronDownIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search projects..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      aria-label="Search projects"
                    />
                    <CommandList>
                      <CommandEmpty>No projects found.</CommandEmpty>
                      {notionProjects
                        .filter((project) =>
                          project?.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .map((project) => (
                          <CommandItem
                            key={project.id}
                            onSelect={() => {
                              setSelectedProject(project.id);
                              setProjectDropdownOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            {project.name}
                          </CommandItem>
                        ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              className="w-[80px]"
              onClick={handleExport}
              disabled={exportLoading || !selectedProject}
            >
              {exportLoading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Export'
              )}
            </Button>
          </div>
        )}
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
  },
);
