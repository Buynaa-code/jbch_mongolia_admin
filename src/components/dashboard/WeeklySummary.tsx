'use client';

import React from 'react';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import { WeeklyProgram } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Clock, User, ArrowRight } from 'lucide-react';

interface WeeklySummaryProps {
  program: WeeklyProgram | null;
}

export function WeeklySummary({ program }: WeeklySummaryProps) {
  if (!program) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Энэ долоо хоногийн хөтөлбөр</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Хөтөлбөр оруулаагүй байна
            </p>
            <Link href="/weekly-program">
              <Button variant="outline" size="sm">
                Хөтөлбөр нэмэх
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Энэ долоо хоногийн хөтөлбөр</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(program.date)}
          </p>
        </div>
        <Link href="/weekly-program">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Бүгдийг харах
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {program.items.slice(0, 5).map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg',
                index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''
              )}
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 min-w-[60px]">
                <Clock className="h-4 w-4" />
                {item.time}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.title}
                </p>
                {item.leader && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.leader}
                  </p>
                )}
              </div>
              {item.duration && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {item.duration}
                </span>
              )}
            </div>
          ))}
          {program.items.length > 5 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
              +{program.items.length - 5} бусад...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default WeeklySummary;
