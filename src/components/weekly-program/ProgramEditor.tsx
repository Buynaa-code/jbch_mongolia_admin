'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ProgramItem } from '@/types';
import { DraggableItem } from './DraggableItem';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Plus, Save } from 'lucide-react';

interface ProgramEditorProps {
  items: ProgramItem[];
  onChange: (items: ProgramItem[]) => void;
  onSave: () => void;
  onAddItem: () => void;
  onEditItem: (item: ProgramItem) => void;
  onDeleteItem: (item: ProgramItem) => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export function ProgramEditor({
  items,
  onChange,
  onSave,
  onAddItem,
  onEditItem,
  onDeleteItem,
  isSaving = false,
  hasChanges = false,
}: ProgramEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      onChange(newItems);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Хөтөлбөрийн дараалал</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddItem}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Нэмэх
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            isLoading={isSaving}
            disabled={!hasChanges}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Хадгалах
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Хөтөлбөрт зүйл нэмээгүй байна
            </p>
            <Button variant="outline" onClick={onAddItem} leftIcon={<Plus className="h-4 w-4" />}>
              Эхний зүйл нэмэх
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item) => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    onEdit={() => onEditItem(item)}
                    onDelete={() => onDeleteItem(item)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {hasChanges && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Өөрчлөлтүүд хадгалагдаагүй байна. Хадгалах товчийг дарна уу.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProgramEditor;
