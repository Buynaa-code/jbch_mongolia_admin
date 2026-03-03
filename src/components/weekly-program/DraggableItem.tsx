'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProgramItem } from '@/types';
import { cn } from '@/lib/utils';
import { GripVertical, Clock, User, Pencil, Trash2 } from 'lucide-react';

interface DraggableItemProps {
  item: ProgramItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function DraggableItem({ item, onEdit, onDelete }: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
        'transition-shadow',
        isDragging && 'shadow-lg z-50 opacity-90'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Order Number */}
      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          {item.order}
        </span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 min-w-[70px] text-sm text-gray-500 dark:text-gray-400">
        <Clock className="h-4 w-4" />
        {item.time}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {item.title}
        </p>
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {item.description}
          </p>
        )}
      </div>

      {/* Leader */}
      {item.leader && (
        <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <User className="h-4 w-4" />
          <span className="truncate max-w-[120px]">{item.leader}</span>
        </div>
      )}

      {/* Duration */}
      {item.duration && (
        <span className="hidden md:block text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {item.duration}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
          title="Засах"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
          title="Устгах"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default DraggableItem;
