/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  GripVerticalIcon,
  PenIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Button } from "@workspace/ui/components/button";
import { ImagePreview } from "@workspace/ui/components/image-preview-modal";
import { toast } from "@workspace/ui/components/sonner";
import { Textarea } from "@workspace/ui/components/textarea";

import { deleteDesignFiles } from "~/actions/design-files/delete-design-files";
import { updateDesignFiles } from "~/actions/design-files/update-design-files";
import { useActiveEpic } from "~/hooks/use-active-epic";
import { useActiveProject } from "~/hooks/use-active-project";

// Define the data structure based on your input
export interface DesignFile {
  id: string;
  filename: string;
  description: string;
  designFlowDoc: string;
  orderIndex: number;
  epicId: string;
  accessUrl: string;
  subFiles?: DesignFile[];
  parentFileId?: string;
}

const ItemTypes = {
  ITEM: "designFile",
};

const getItemAtPath = (
  items: DesignFile[],
  path: number[],
): DesignFile | null => {
  if (path.length === 0) return null;
  let currentItems = items;
  let item: DesignFile | null = null;
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    if (index >= currentItems.length) return null;
    item = currentItems[index];
    if (i < path.length - 1) {
      if (!item.subFiles) return null;
      currentItems = item.subFiles;
    }
  }
  return item;
};
const removeItemAtPath = (
  items: DesignFile[],
  path: number[],
): DesignFile[] => {
  if (path.length === 0) return [...items];
  const result = [...items];
  if (path.length === 1) {
    result.splice(path[0], 1);
    return result;
  }
  const parentPath = path.slice(0, -1);
  const parentItem = getItemAtPath(result, parentPath);
  if (parentItem && parentItem.subFiles) {
    const index = path[path.length - 1];
    parentItem.subFiles = [
      ...parentItem.subFiles.slice(0, index),
      ...parentItem.subFiles.slice(index + 1),
    ];
  }
  return result;
};
const insertItemAtPath = (
  items: DesignFile[],
  path: number[],
  item: DesignFile,
): DesignFile[] => {
  const result = [...items];
  if (path.length === 1) {
    result.splice(path[0], 0, item);
    return result;
  }
  const parentPath = path.slice(0, -1);
  const parentItem = getItemAtPath(result, parentPath);
  if (parentItem) {
    if (!parentItem.subFiles) parentItem.subFiles = [];
    const index = path[path.length - 1];
    parentItem.subFiles = [
      ...parentItem.subFiles.slice(0, index),
      item,
      ...parentItem.subFiles.slice(index),
    ];
  }
  return result;
};
const moveItem = (
  items: DesignFile[],
  sourcePath: number[],
  destinationPath: number[],
): DesignFile[] => {
  if (
    sourcePath.length === destinationPath.length &&
    sourcePath.every((value, index) => value === destinationPath[index])
  ) {
    return items;
  }
  const sourceItem = getItemAtPath(items, sourcePath);
  if (!sourceItem) return items;
  //@ts-ignore
  if (sourceItem?.subFiles?.length > 0 && destinationPath[1] > -1) return items;
  // Prevent dropping a parent into its own child
  if (destinationPath.length > sourcePath.length) {
    const isChildPath = sourcePath.every(
      (val, index) =>
        index < destinationPath.length && val === destinationPath[index],
    );
    if (isChildPath) return items;
  }

  // Check nesting level limit (max 1)
  if (destinationPath.length > 2) {
    return items;
  }
  // Remove the item from its original position
  const newItems = removeItemAtPath(items, sourcePath);
  // Adjust destination path if needed (if source was before destination)
  const adjustedDestPath = [...destinationPath];

  // Insert the item at the new position
  return insertItemAtPath(newItems, adjustedDestPath, sourceItem);
};
// DraggableItem component
const DraggableItem: React.FC<{
  item: DesignFile;
  path: number[];
  onMove: (sourcePath: number[], destinationPath: number[]) => void;
  onDelete?: (itemId: string, path: number[]) => void;
  onDescriptionChange?: (path: number[], description: string) => void;
  onTitleChange?: (path: number[], filename: string) => void;
  type?: "main" | "child";
}> = ({
  item,
  path,
  onMove,
  onDelete,
  type,
  onDescriptionChange,
  onTitleChange,
}) => {
  const [currentItem, setCurrentItem] = useState<{ id: string }>({ id: "" });
  const [screenTitle, setScreenTitle] = useState({
    editable: false,
    value: "",
    error: "",
  });
  const [screenDescription, setScreenDescription] = useState({
    editable: false,
    value: "",
    error: "",
  });
  const previewRef = useRef<HTMLLIElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.ITEM,
    item: () => {
      setCurrentItem(item);
      return { path };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (draggedItem: { path: number[] }, monitor) => {
      if (monitor.didDrop()) return;
      onMove(draggedItem.path, path);
      setCurrentItem({ id: "" });
    },
    canDrop: (draggedItem: { path: number[] }) => {
      if (path.length === 0) return true;
      const dragPath = draggedItem.path;
      if (dragPath.length <= path.length) {
        return !path.every((v, i) => i < dragPath.length && v === dragPath[i]);
      }
      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });
  const [{ isOverChild }, dropChild] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (draggedItem: { path: number[] }) => {
      const newPath = [...path, item.subFiles?.length || 0];
      onMove(draggedItem.path, newPath);
      setCurrentItem({ id: "" });
    },
    canDrop: (draggedItem: { path: number[] }) => {
      const dragPath = draggedItem.path;
      if (dragPath.length <= path.length) {
        return !path.every(
          (value, index) =>
            index < dragPath.length && value === dragPath[index],
        );
      }
      return path.length < 2;
    },
    collect: (monitor) => ({
      isOverChild: monitor.isOver(),
    }),
  });
  const [{ isOverAfter }, dropAfter] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (draggedItem: { path: number[] }) => {
      const newPath = [...path.slice(0, -1), path[path.length - 1] + 1];
      onMove(draggedItem.path, newPath);
      setCurrentItem({ id: "" });
    },
    collect: (monitor) => ({
      isOverAfter: monitor.isOver(),
    }),
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isValidTitle = event.target.value.trim().length >= 5;

    setScreenTitle({
      editable: true,
      value: event.target.value,
      error: isValidTitle ? "" : "Minimum 5 characters required",
    });
  };
  const handleTitleSave = () => {
    const isValidTitle = screenTitle.value.trim().length >= 5;
    if (isValidTitle && onTitleChange) {
      onTitleChange(path, screenTitle.value);
      setScreenTitle((data) => ({ ...data, editable: false }));
    }
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const isValidDescription =
      event.target.value.trim().length >= 5 &&
      event.target.value.trim().length <= 500;

    setScreenDescription({
      editable: true,
      value: event.target.value,
      error: isValidDescription ? "" : "Min 5 chars / Max 500 chars required",
    });
    if (isValidDescription && onDescriptionChange)
      onDescriptionChange(path, event.target.value);
  };

  useEffect(() => {
    if (previewRef.current) preview(previewRef.current);
    if (containerRef.current) drop(containerRef.current);
    if (handleRef.current) drag(handleRef.current);
  }, [preview, drop, drag]);
  useEffect(() => {
    setScreenTitle({ editable: false, value: item.filename, error: "" });
    setScreenDescription({
      editable: true,
      value: item.description,
      error: "",
    });
  }, [item]);

  return (
    <li
      ref={previewRef}
      className={`mb-1 ${type === "main" ? "" : "ml-8"}`}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      {type === "main" && currentItem.id !== item.id && (
        <div
          // @ts-ignore
          ref={dropAfter}
          className={`transition-all duration-200 ease-in-out ${
            isOverAfter
              ? "bg-blue-100 py-2 border-t-2 border-blue-500 rounded-t-lg"
              : "h-1"
          }`}
        >
          {isOverAfter && (
            <div className="flex items-center px-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <div className="ml-2 text-sm font-medium text-blue-600">
                Drop here to add as a main screen
              </div>
            </div>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className={`
          flex items-start gap-4 p-4 rounded-lg border
          ${
            type === "main"
              ? "bg-white border-gray-200 shadow-sm"
              : "bg-gray-50 border-gray-100"
          }
          ${isOver ? "ring-2 ring-blue-500" : ""}
        `}
      >
        <div
          ref={handleRef}
          className={`cursor-move ${
            type === "main" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <GripVerticalIcon className="w-5 h-5" />
        </div>

        <div className="relative flex-shrink-0 cursor-pointer">
          <ImagePreview previewClassName="object-contain">
            <img
              src={item.accessUrl}
              alt={`Screen ${item.orderIndex}`}
              className={`object-contain rounded-md ${
                type === "main" ? "w-52 h-32" : "w-44 h-28"
              }`}
            />
          </ImagePreview>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {screenTitle.editable ? (
              <div className="flex flex-wrap w-full p-1 bg-white rounded ring-1 ring-gray-300">
                <div className="flex w-full">
                  <input
                    className="flex-1 h-6 px-2 text-xs border-none outline-none bg-inherit"
                    value={screenTitle.value}
                    onChange={handleTitleChange}
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      className="p-1 rounded h-fit"
                      variant="outline"
                      onClick={() =>
                        setScreenTitle({
                          error: "",
                          value: item.filename,
                          editable: false,
                        })
                      }
                    >
                      <XIcon className="inline-block size-3" />
                    </Button>
                    <Button
                      className="p-1 rounded h-fit"
                      onClick={handleTitleSave}
                    >
                      <CheckIcon className="inline-block size-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-red-600">
                    {screenTitle.error}
                  </span>
                </div>
              </div>
            ) : (
              <span
                className={`font-medium flex items-center gap-2 ${
                  type === "main" ? "text-gray-800" : "text-gray-700"
                }`}
              >
                {item.filename}
                <Button
                  className="p-1 rounded h-fit"
                  variant="outline"
                  onClick={() =>
                    setScreenTitle((d) => ({ ...d, editable: true }))
                  }
                >
                  <PenIcon className="inline-block size-3" />
                </Button>
              </span>
            )}

            <div className="ml-auto">
              <Button
                title="Delete designFile"
                variant="ghost"
                size="icon"
                className={`w-8 h-8 hover:bg-destructive/10 ${
                  type === "main" ? "text-destructive" : "text-gray-500"
                }`}
                onClick={() => onDelete?.(item.id, path)}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Textarea
            value={screenDescription.value}
            onChange={handleDescriptionChange}
            placeholder="Enter screen description..."
            className={`min-h-[100px] text-black ${
              type === "main" ? "border-gray-300" : "border-gray-200 bg-white"
            }`}
          />
          <span className="text-xs text-red-600">
            {screenDescription.error}
          </span>
          <div
            className={`mt-1 text-sm ${
              type === "main" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {screenDescription.value.length} / 500 characters
          </div>
        </div>
      </div>

      {currentItem?.id !== item.id &&
        type !== "child" &&
        (!item.subFiles || item.subFiles.length === 0) && (
          <div
            // @ts-ignore
            ref={dropChild}
            className={`transition-all duration-200 ease-in-out ${
              isOverChild
                ? "bg-blue-100 py-2 ml-6 border-b-2 border-blue-500 rounded-b-lg"
                : "h-1"
            }`}
          >
            {isOverChild && (
              <div className="flex items-center px-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <div className="ml-2 text-sm font-medium text-blue-600">
                  Drop here to add as a sub screen
                </div>
              </div>
            )}
          </div>
        )}

      {item?.subFiles && item.subFiles.length > 0 && (
        <div className={`mt-2 ${type === "main" ? "ml-8" : "ml-8"}`}>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 ml-4"></div>
            <ul className="space-y-2">
              {item.subFiles.map((child, index) => (
                <DraggableItem
                  key={child.id}
                  item={child}
                  path={[...path, index]}
                  onMove={onMove}
                  onDelete={onDelete}
                  onDescriptionChange={onDescriptionChange}
                  onTitleChange={onTitleChange}
                  type="child"
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

const DesignFileDragDrop: React.FC<{ designFiles: any[] }> = ({
  designFiles,
}) => {
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();
  const saveChangesTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [items, setItems] = useState<DesignFile[]>([]);
  const deleteFilesTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const fileIdsForDeletionRef = useRef<string[]>([]);

  useEffect(() => {
    if (designFiles.length > 0) setItems(designFiles);
  }, [designFiles]);

  const saveChanges = async (updatedItems: DesignFile[]) => {
    clearTimeout(saveChangesTimeoutRef.current!);
    saveChangesTimeoutRef.current = setTimeout(async () => {
      const result = await updateDesignFiles({
        projectId: activeProject.id,
        epicId: activeEpic.id,
        updatedFiles: updatedItems,
      });

      if (result?.serverError || result?.validationErrors)
        toast.error("Can't save changes, Something went wrong");
      else toast.success("Changes Saved Successfully");
    }, 1000);
  };

  const deleteFiles = async () => {
    clearTimeout(deleteFilesTimeoutRef.current!);
    deleteFilesTimeoutRef.current = setTimeout(async () => {
      const result = await deleteDesignFiles({
        projectId: activeProject.id,
        epicId: activeEpic.id,
        fileIdsForDeletion: fileIdsForDeletionRef.current,
      });
      if (result?.serverError || result?.validationErrors)
        toast.error("Can't delete screens, Something went wrong");
      else {
        toast.success("Screens Deleted Successfully");
        fileIdsForDeletionRef.current = [];
      }
    }, 1000);
  };

  const handleMove = useCallback(
    (sourcePath: number[], destinationPath: number[]) => {
      const newItems = moveItem(items, sourcePath, destinationPath);
      setItems(newItems);
      saveChanges(newItems);
    },
    [items],
  );
  const handleDeleteItem = useCallback(
    (itemId: string, path: number[]) => {
      const updatedItems = removeItemAtPath(items, path);
      setItems(updatedItems);
      fileIdsForDeletionRef.current.push(itemId);
      deleteFiles();
    },
    [items],
  );
  const handleTitleChange = useCallback((path: number[], newTitle: string) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const item = getItemAtPath(updatedItems, path);
      if (item) {
        item.filename = newTitle;
      }
      saveChanges(updatedItems);
      return updatedItems;
    });
  }, []);
  const handleDescriptionChange = useCallback(
    (path: number[], newDescription: string) => {
      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        const item = getItemAtPath(updatedItems, path);
        if (item) {
          item.description = newDescription;
        }
        saveChanges(updatedItems);
        return updatedItems;
      });
    },
    [],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <ul className="pl-0 list-none">
        {items.map((item, index) => (
          <div className="my-6" key={item.id}>
            <DraggableItem
              item={item}
              path={[index]}
              onMove={handleMove}
              onDelete={handleDeleteItem}
              onDescriptionChange={handleDescriptionChange}
              onTitleChange={handleTitleChange}
              type="main"
            />
          </div>
        ))}
      </ul>
    </DndProvider>
  );
};

export default DesignFileDragDrop;
