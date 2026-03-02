'use client';

import React from 'react';
import { Event, Column } from '@/types';
import { cn, formatDate, statusColors, statusLabels } from '@/lib/utils';
import { Table, Badge, Button } from '@/components/ui';
import { Pencil, Trash2, Eye, MapPin, Clock } from 'lucide-react';

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onView?: (event: Event) => void;
}

export function EventList({
  events,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
}: EventListProps) {
  const columns: Column<Event>[] = [
    {
      key: 'title',
      label: 'Гарчиг',
      sortable: true,
      render: (_, event) => (
        <div className="flex items-center gap-3">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="h-10 w-10 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {event.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {event.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Огноо',
      sortable: true,
      render: (_, event) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">
            {formatDate(event.date)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Clock className="h-3 w-3" />
            {event.time}
            {event.endTime && ` - ${event.endTime}`}
          </p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Байршил',
      render: (_, event) => (
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4 text-gray-400" />
          {event.location}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Төлөв',
      sortable: true,
      render: (_, event) => (
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            statusColors[event.status]
          )}
        >
          {statusLabels[event.status]}
        </span>
      ),
    },
    {
      key: 'attendees',
      label: 'Оролцогчид',
      sortable: true,
      render: (_, event) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {event.attendees || '-'}
        </span>
      ),
    },
  ];

  const actions = (event: Event) => (
    <div className="table-actions">
      {onView && (
        <button
          onClick={() => onView(event)}
          className="action-btn action-btn-view"
          title="Харах"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={() => onEdit(event)}
        className="action-btn action-btn-edit"
        title="Засах"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(event)}
        className="action-btn action-btn-delete"
        title="Устгах"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <Table
      data={events}
      columns={columns}
      searchable
      searchKeys={['title', 'description', 'location']}
      pagination
      pageSize={10}
      isLoading={isLoading}
      actions={actions}
      emptyMessage="Үйл явдал олдсонгүй"
    />
  );
}

export default EventList;
