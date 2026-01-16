import { useState } from 'react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LoaderCircleIcon,
  Trash2Icon,
} from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
} from '@workspace/ui/components/collapsible';
import { ImagePreview } from '@workspace/ui/components/image-preview-modal';

import { type ScreenItemType } from './use-screen-items';

export type ScreenItemProps = {
  screenItem: ScreenItemType;
  activeScreenItemId?: string;
  onSelectScreenItem: (screenId: string) => void;
  onDeleteScreenItem: (mainScreenId: string, subScreenId?: string) => void;
};

export function ScreenItem(props: ScreenItemProps) {
  const {
    screenItem,
    activeScreenItemId,
    onSelectScreenItem,
    onDeleteScreenItem,
  } = props;

  const [subFilesExpanded, setSubFilesExpanded] = useState<boolean>(true);
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpandSubfiles = () =>
    setSubFilesExpanded((expanded) => !expanded);

  const hasSubfiles = Boolean(screenItem.subFiles?.length);

  return (
    <section className="overflow-hidden border rounded-lg screen-item">
      <div
        className={`p-4 cursor-pointer ${activeScreenItemId === screenItem.id ? 'bg-muted' : 'bg-background'}`}
        onClick={() => onSelectScreenItem(screenItem.id)}
      >
        <div className="flex items-start gap-4">
          {/* Screen thumbnail */}

          <ImagePreview
            previewClassName="object-contain" // This will ensure the full image fits while maintaining aspect ratio
          >
            <img
              src={screenItem.accessUrl}
              alt={`Screen ${screenItem.filename}`}
              className="max-w-40 border rounded h-auto max-h-40 overflow-hidden block"
            />
          </ImagePreview>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {/* Expand/collapse button for screens with children */}
                {hasSubfiles && (
                  <button onClick={handleToggleExpandSubfiles} className="p-1">
                    {subFilesExpanded ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {screenItem.isGenerating && (
                  <span className="p-1 bg-blue-600 rounded-full">
                    <LoaderCircleIcon className="text-white size-4 animate-spin" />
                  </span>
                )}
                {screenItem.isGenerationCompleted && (
                  <span className="p-1 bg-green-600 rounded-full">
                    <CheckIcon className="text-white size-4" />
                  </span>
                )}
                {/* <Button
                  variant="ghost"
                  size="icon"
                >
                  <EditIcon className="w-4 h-4" />
                  <span className="sr-only">Edit</span>
                </Button> */}

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDeleteScreenItem(screenItem.id)}
                >
                  <Trash2Icon className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <h1 className="font-semibold">{screenItem.filename}</h1>
            <div className="flex flex-col items-start">
              <p
                className={`text-sm mt-1 transition-all ${expanded ? '' : 'line-clamp-2'}`}
              >
                {screenItem.description}
              </p>
              <Button
                variant="link"
                size="sm"
                className="p-0 mt-1 text-sm cursor-pointer"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? 'Show less' : 'Show more'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subfiles */}
      {hasSubfiles && (
        <Collapsible open={subFilesExpanded}>
          <CollapsibleContent>
            <div className="border-y-2 border-l-2 border-muted/80">
              <div
                className={`pl-6 pt-2 pb-1 text-muted-foreground text-xs  tracking-wide font-medium ${activeScreenItemId === screenItem.id ? 'bg-muted/30' : 'bg-muted/10'}`}
              >
                Subscreens
              </div>
              {screenItem.subFiles?.map((subScreenItem) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [expanded, setExpanded] = useState(false);

                return (
                  <div
                    key={subScreenItem.id}
                    className={`p-4 border-b last:border-b-0 pl-8 cursor-pointer ${activeScreenItemId === screenItem.id ? 'bg-muted/30' : 'bg-muted/10'}`}
                    onClick={() => onSelectScreenItem(screenItem.id)}
                  >
                    <div className="flex items-start gap-4">
                      <ImagePreview
                        previewClassName="object-contain" // This will ensure the full image fits while maintaining aspect ratio
                      >
                        <img
                          src={subScreenItem.accessUrl}
                          alt={`Screen ${subScreenItem.filename}`}
                          className="w-40 border rounded h-28"
                        />
                      </ImagePreview>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between">
                          <div className="flex items-center justify-end w-full gap-2">
                            {subScreenItem.isGenerating && (
                              <span className="p-1 bg-blue-600 rounded-full">
                                <LoaderCircleIcon className="text-white size-4 animate-spin" />
                              </span>
                            )}
                            {subScreenItem.isGenerationCompleted && (
                              <span className="p-1 bg-green-600 rounded-full">
                                <CheckIcon className="text-white size-4" />
                              </span>
                            )}
                            {/* <Button
                            variant="ghost"
                            size="icon"
                          >
                            <EditIcon className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button> */}

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                onDeleteScreenItem(
                                  screenItem.id,
                                  subScreenItem.id,
                                )
                              }
                            >
                              <Trash2Icon className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                          <h1 className="font-semibold">
                            {subScreenItem.filename}
                          </h1>
                          <div className="flex flex-col items-start">
                            <p
                              className={`text-sm mt-1 transition-all ${expanded ? '' : 'line-clamp-2'}`}
                            >
                              {screenItem.description}
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 mt-1 text-sm cursor-pointer"
                              onClick={() => setExpanded((prev) => !prev)}
                            >
                              {expanded ? 'Show less' : 'Show more'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </section>
  );
}
