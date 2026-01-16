/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { Editor, EditorEvents } from '@tiptap/react';
import { Check, Edit, Loader, PenIcon, Save, X } from 'lucide-react';

import { convertHtmlToMarkdown } from '@workspace/markdown/convert-html-to-markdown';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { CustomTooltip } from '@workspace/ui/components/custom-tooltip';
import { Input } from '@workspace/ui/components/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@workspace/ui/components/sheet';
import { toast } from '@workspace/ui/components/sonner';
import { cn } from '@workspace/ui/lib/utils';

import { deleteChecklistItem } from '~/actions/user-stories/check-list-delete';
import { MarkdownEditor } from '~/components/editor/markdown-editor';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveProject } from '~/hooks/use-active-project';
import { useSetState } from '~/hooks/useSetState';
import { CreateUserStoryDialog } from './upsert-user-story-dialog';
import { CheckListItems, UserStory } from './user-story-data-table';

interface StoryDetailsSidebarProps {
  story: UserStory;
  onClose: (storyId: string) => void;
  onToggleChecklistItem: (
    storyId: string,
    itemId: string,
    checked: boolean
  ) => void;
  onAcceptanceCriteriaChange: (storyId: string, description: string) => void;
  onAddChecklistItem: (storyId: string, itemName: string) => void;
  onEditChecklistItem: (
    storyId: string,
    itemId: string,
    itemName: string
  ) => void;
}

export function StoryDetailsSidebar({
  story,
  onClose,
  onToggleChecklistItem,
  onAcceptanceCriteriaChange,
  onAddChecklistItem,
  onEditChecklistItem
}: StoryDetailsSidebarProps) {
  const [checklist, setChecklist] = useSetState({
    editItemId: '',
    editItemText: '',
    newItemText: '',
    deleteId: ''
  });
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();
  const [acceptanceCriteria, setAcceptanceCriteria] = useSetState({
    content: '',
    edited: false,
    markDownEditorContentCancel: false
  });
  const handleAcceptanceCriteriaChange = (value: string) => {
    const newAcceptanceCriteria = value;
    onAcceptanceCriteriaChange(story?.id, newAcceptanceCriteria);
  };

  const startEditItem = (id: string, text: string) => {
    setChecklist({ editItemId: id, editItemText: text });
  };

  const cancelEdit = () => {
    setChecklist({ editItemId: '', editItemText: '' });
  };

  const saveEdit = (id: string) => {
    if (checklist.editItemText.trim()) {
      onEditChecklistItem(story.id, id, checklist.editItemText);
      cancelEdit();
    }
  };

  const handleAddItem = () => {
    if (checklist.newItemText.trim()) {
      onAddChecklistItem(story.id, checklist.newItemText);
      setChecklist({ newItemText: '' });
    }
  };
  const handleCheckListDelete = async (id: string) => {
    setChecklist({ deleteId: id });
    const result = await deleteChecklistItem({ id });
    if (!result?.serverError && !result?.validationErrors) {
      toast.success(`Check list deleted successfully`, userStoryToastPosition);
    } else {
      toast.error(`Can't delete check list`, userStoryToastPosition);
    }
    setChecklist({ deleteId: '' });
  };
  const editorRef = useRef<Editor>(undefined);
  const contentEditDebounceTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const handleContentEdited = (props: EditorEvents['update']) => {
    const { editor, transaction } = props;
    if (contentEditDebounceTimeoutRef.current)
      clearTimeout(contentEditDebounceTimeoutRef.current);
    contentEditDebounceTimeoutRef.current = setTimeout(() => {
      const editedFlow = convertHtmlToMarkdown(editor.getHTML());

      if (transaction.docChanged && editedFlow !== acceptanceCriteria.content) {
        setAcceptanceCriteria({ edited: true });
      } else {
        setAcceptanceCriteria({ edited: false });
      }
    });
  };

  useEffect(() => {
    if (story.acceptanceCriteria) {
      setAcceptanceCriteria({ content: story.acceptanceCriteria });
    }
  }, [story.acceptanceCriteria]);
  const handleEditUserStory = async (story: UserStory) => {
    NiceModal.show(CreateUserStoryDialog, {
      projectId: activeProject.id,
      epicId: activeEpic.id,
      story,
      type: 'update'
    });
  };
  return (
    <Sheet
      open={!!story}
      onOpenChange={() => onClose(story.id)}
    >
      <SheetContent className="w-full sm:max-w-xl max-h-[100vh] overflow-y-auto overscroll-contain">
        {story && (
          <>
            <SheetHeader>
              <SheetTitle className="sr-only">
                {story.name} - User Story Details
              </SheetTitle>
              <SheetDescription className="sr-only">
                View and edit user story description and checklist items
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-5">
              <div>
                <div className="flex items-center justify-start">
                  <h2
                    className="text-xl font-semibold"
                    aria-hidden="true"
                  >
                    {story.name}
                  </h2>
                  <CustomTooltip content={'Edit user story'}>
                    <span className="ml-2 text-black">
                      <Button
                        className="p-1 rounded h-fit"
                        variant="outline"
                        onClick={() => handleEditUserStory(story)}
                      >
                        <PenIcon className="inline-block size-3" />
                      </Button>
                    </span>
                  </CustomTooltip>
                </div>
                <p className="text-base p-1">{story.description}</p>
              </div>
              {!story.acceptanceCriteria && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-muted/50 animate-pulse">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">
                    Generating acceptance criteria...
                  </span>
                </div>
              )}
              <div className="relative gap-4">
                <MarkdownEditor
                  markdownContent={acceptanceCriteria.content}
                  onEditorInit={(editor) => (editorRef.current = editor)}
                  onContentEdited={handleContentEdited}
                  readOnly={!acceptanceCriteria.content}
                  replaceOriginalContent={
                    acceptanceCriteria.markDownEditorContentCancel
                  }
                  className="body-style"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={() => {
                    setAcceptanceCriteria({
                      edited: false
                    });
                    handleAcceptanceCriteriaChange(
                      convertHtmlToMarkdown(editorRef.current?.getHTML() || '')
                    );
                  }}
                  size="sm"
                  disabled={!acceptanceCriteria.edited}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={() =>
                    setAcceptanceCriteria({
                      edited: false,
                      markDownEditorContentCancel:
                        !acceptanceCriteria.markDownEditorContentCancel
                    })
                  }
                  variant="outline"
                  size="sm"
                  disabled={!acceptanceCriteria.edited}
                >
                  Cancel
                </Button>
              </div>

              {/* Checklist section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Checklist</h3>
                <div className="space-y-2">
                  {story?.checkListItems && story?.checkListItems?.length > 0
                    ? story?.checkListItems?.map((item: CheckListItems) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-2"
                        >
                          {checklist.editItemId === item.id ? (
                            <>
                              <Input
                                value={checklist.editItemText}
                                onChange={(e) =>
                                  setChecklist({ editItemText: e.target.value })
                                }
                                className="flex-grow"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => saveEdit(item.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={cancelEdit}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <div className="relative flex items-center space-x-2 group">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={(checked) =>
                                  onToggleChecklistItem(
                                    story.id,
                                    item.id,
                                    checked as boolean
                                  )
                                }
                                id={`checkbox-${item.id}`}
                                aria-labelledby={`label-${item.id}`}
                                className="w-4 h-4"
                              />
                              <label
                                id={`label-${item.id}`}
                                htmlFor={`checkbox-${item.id}`}
                                className={cn(
                                  'text-sm cursor-pointer flex-grow',
                                  item.completed &&
                                    'line-through text-muted-foreground'
                                )}
                              >
                                {item.name}
                              </label>
                              <div className="flex transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    startEditItem(item.id, item.name)
                                  }
                                  className="p-1"
                                >
                                  <Edit className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    checklist.deleteId !== item.id &&
                                    handleCheckListDelete(item.id)
                                  }
                                  className="p-1"
                                >
                                  {checklist.deleteId === item.id ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <X className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    : ''}
                </div>
                <div className="flex items-center pt-2 space-x-2">
                  <Input
                    disabled={!story.acceptanceCriteria}
                    placeholder="Add new checklist item"
                    value={checklist.newItemText}
                    onChange={(e) =>
                      setChecklist({ newItemText: e.target.value })
                    }
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && checklist.newItemText.trim()) {
                        handleAddItem();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddItem}
                    disabled={!checklist.newItemText.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
