'use client';

import { Dispatch, SetStateAction } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

import { DesignFileDto } from '~/types/dtos/design-file-dto';
import { DraggableFileItem } from './draggable-file-item';

export type DraggableFileGridProps = {
  designFiles: DesignFileDto[];
  onChange: Dispatch<SetStateAction<DesignFileDto[]>>;
};

export function DraggableFileGrid(props: DraggableFileGridProps) {
  const { designFiles, onChange } = props;

  // Sensors to make dnd work on mouse, touch and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // handlers
  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over) return;
    if (active.id !== over.id) {
      const currentIndex = designFiles.findIndex(
        (file) => file.id === active.id
      );
      const destIndex = designFiles.findIndex((file) => file.id === over.id);
      const sortedfiles = arrayMove(designFiles, currentIndex, destIndex);
      onChange(sortedfiles);
    }
  };

  const handleDeleteFile = (id: string) => {
    const otherFiles = designFiles.filter((file) => file.id !== id);
    onChange(otherFiles);
  };

  return (
    <section className="mt-8 grid grid-cols-3 gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={designFiles}
          strategy={rectSortingStrategy}
        >
          {designFiles.map((designFile) => (
            <DraggableFileItem
              key={designFile.id}
              designFile={designFile}
              onDelete={handleDeleteFile}
            />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
}
