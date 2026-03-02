'use client';

import React from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { ActivityItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import {
  Calendar,
  Music,
  BookOpen,
  Users,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const typeIcons = {
  event: Calendar,
  song: Music,
  verse: BookOpen,
  user: Users,
  program: ClipboardList,
};

const typeColors = {
  event: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  song: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
  verse: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  user: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
  program: 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30',
};

const actionIcons = {
  created: Plus,
  updated: Pencil,
  deleted: Trash2,
};

const actionLabels = {
  created: 'үүсгэсэн',
  updated: 'шинэчилсэн',
  deleted: 'устгасан',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сүүлийн үйл ажиллагаа</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Үйл ажиллагаа байхгүй байна
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const TypeIcon = typeIcons[activity.type];
              const ActionIcon = actionIcons[activity.action];

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg', typeColors[activity.type])}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {actionLabels[activity.action]}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
