'use client';

import React, { useState } from 'react';
import { Verse, Column } from '@/types';
import { cn, truncateText } from '@/lib/utils';
import { Table, Badge, Button, Card } from '@/components/ui';
import { Pencil, Trash2, BookOpen, LayoutGrid, List } from 'lucide-react';

interface VerseListProps {
  verses: Verse[];
  isLoading?: boolean;
  onEdit: (verse: Verse) => void;
  onDelete: (verse: Verse) => void;
}

export function VerseList({
  verses,
  isLoading = false,
  onEdit,
  onDelete,
}: VerseListProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const columns: Column<Verse>[] = [
    {
      key: 'reference',
      label: 'Лавлагаа',
      sortable: true,
      render: (_, verse) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {verse.reference}
          </span>
        </div>
      ),
    },
    {
      key: 'text',
      label: 'Текст',
      render: (_, verse) => (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {truncateText(verse.text, 100)}
        </p>
      ),
    },
    {
      key: 'category',
      label: 'Ангилал',
      sortable: true,
      render: (_, verse) => (
        <Badge variant="success">{verse.category}</Badge>
      ),
    },
    {
      key: 'translation',
      label: 'Орчуулга',
      render: (_, verse) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {verse.translation || '-'}
        </span>
      ),
    },
  ];

  const actions = (verse: Verse) => (
    <div className="table-actions">
      <button
        onClick={() => onEdit(verse)}
        className="action-btn action-btn-edit"
        title="Засах"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(verse)}
        className="action-btn action-btn-delete"
        title="Устгах"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'table'
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'cards'
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <Table
          data={verses}
          columns={columns}
          searchable
          searchKeys={['reference', 'text', 'category']}
          pagination
          pageSize={10}
          actions={actions}
          emptyMessage="Ишлэл олдсонгүй"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              Ишлэл олдсонгүй
            </div>
          ) : (
            verses.map((verse) => (
              <Card key={verse.id} className="hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {verse.reference}
                    </span>
                  </div>
                  <Badge variant="success" size="sm">{verse.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                  "{verse.text}"
                </p>
                {verse.translation && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    — {verse.translation}
                  </p>
                )}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(verse)}
                    leftIcon={<Pencil className="h-3.5 w-3.5" />}
                  >
                    Засах
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(verse)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Устгах
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default VerseList;
