'use client';

import { useEffect } from 'react';
import Color from '@tiptap/extension-color';
import type { Level } from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Editor, EditorContent, EditorEvents, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  BoldIcon,
  Code2Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  HeadingIcon,
  ItalicIcon,
  ListIcon,
  Redo2Icon,
  StrikethroughIcon,
  Undo2Icon
} from 'lucide-react';

import { convertMarkdownToHtml } from '@workspace/markdown/convert-markdown-to-html';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';

export type MarkdownEditorProps = {
  markdownContent: string;
  onEditorInit?: (editor: Editor) => void;
  onContentEdited?: (props: EditorEvents['update']) => void;
  enableEditHistoryButtons?: boolean;
  hideToolbar?: boolean;
  readOnly?: boolean;
  replaceOriginalContent?: boolean;
  className?: string;
  contentEdited?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
};
/**
 * Custom component for rendering markdown using tiptap editor
 */
export function MarkdownEditor(props: MarkdownEditorProps) {
  const {
    markdownContent,
    onEditorInit,
    onContentEdited,
    enableEditHistoryButtons,
    hideToolbar,
    readOnly,
    replaceOriginalContent,
    className = '',
    contentEdited,
    onSave,
    onCancel
  } = props;

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit,
    Image.configure({ inline: true })
  ];

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    onUpdate: onContentEdited
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(convertMarkdownToHtml(markdownContent));
    }
  }, [editor, markdownContent, replaceOriginalContent]);

  useEffect(() => {
    if (editor) {
      if (readOnly) editor.setEditable(false);
      else editor.setEditable(true);
    }
  }, [editor, readOnly]);

  useEffect(() => {
    if (onEditorInit && editor) onEditorInit(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  return (
    <section className="relative border-2 rounded-md editor">
      {/* Toolbar */}
      {!hideToolbar && (
        <div className="sticky top-0 z-10 flex mt-1 items-center justify-between p-4 bg-white dark:bg-gray-950 border-b">
          {/* Left section - formatting tools */}
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={readOnly}
                className="p-2 text-white bg-black rounded-md dark:bg-white dark:text-black disabled:pointer-events-none disabled:opacity-50"
              >
                <HeadingIcon size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  Heading1Icon,
                  Heading2Icon,
                  Heading3Icon,
                  Heading4Icon,
                  Heading5Icon,
                  Heading6Icon
                ].map((Icon, index) => (
                  <DropdownMenuItem
                    key={index + 1}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: (index + 1) as Level })
                        .run()
                    }
                  >
                    Heading - <Icon size={18} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={
                !editor.can().chain().focus().toggleBold().run() || readOnly
              }
              className="px-2"
            >
              <BoldIcon size={18} />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={
                !editor.can().chain().focus().toggleItalic().run() || readOnly
              }
              className="px-2"
            >
              <ItalicIcon size={18} />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={
                !editor.can().chain().focus().toggleStrike().run() || readOnly
              }
              className="px-2"
            >
              <StrikethroughIcon size={18} />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={readOnly}
              className="px-2"
            >
              <ListIcon size={18} />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              disabled={readOnly}
              className="px-2"
            >
              <Code2Icon size={18} />
            </Button>
          </div>

          {/* Right section - action buttons */}
          <div className="flex items-center gap-2">
            {enableEditHistoryButtons && (
              <>
                <Button
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={
                    !editor.can().chain().focus().undo().run() || readOnly
                  }
                  className="px-2"
                >
                  <Undo2Icon size={18} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={
                    !editor.can().chain().focus().redo().run() || readOnly
                  }
                  className="px-2"
                >
                  <Redo2Icon size={18} />
                </Button>
              </>
            )}
            {contentEdited && (
              <>
                <Button
                  variant="outline"
                  className="px-4"
                  disabled={readOnly}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="px-4"
                  disabled={readOnly}
                  onClick={onSave}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="p-4">
        <EditorContent
          editor={editor}
          className={`min-h-[200px] ${className}`}
        />
      </div>
    </section>
  );
}
