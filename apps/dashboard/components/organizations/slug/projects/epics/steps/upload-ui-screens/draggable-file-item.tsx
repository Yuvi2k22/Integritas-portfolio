import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon, X } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { DesignFileDto } from '~/types/dtos/design-file-dto';

export type DraggableFileItemProps = {
  designFile: DesignFileDto;
  onDelete: (id: string) => void;
};

export function DraggableFileItem(props: DraggableFileItemProps) {
  const { designFile, onDelete } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: designFile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleDeleteClick = () => onDelete(designFile.id);

  return (
    <div
      style={style}
      {...attributes}
      tabIndex={-1}
      className="relative overflow-hidden border rounded-lg select-none group touch-none"
    >
      <div className="relative w-full aspect-video">
        <img
          src={designFile.accessUrl}
          alt={designFile.filename}
          className="absolute inset-0 object-contain w-full h-full"
        />
      </div>
      <div className="absolute transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100">
        <Button
          variant="destructive"
          size="icon"
          className="w-8 h-8"
          onClick={handleDeleteClick}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/90">
        <p className="text-sm truncate">{designFile.filename}</p>
      </div>
      <div
        ref={setNodeRef}
        {...listeners}
        className="absolute transition-opacity opacity-0 cursor-move top-2 left-2 group-hover:opacity-100"
      >
        <GripVerticalIcon className="w-4 h-4 text-foreground" />
      </div>
    </div>
  );
}
