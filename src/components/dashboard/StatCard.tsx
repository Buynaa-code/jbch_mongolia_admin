'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gold';
  className?: string;
}

const colorStyles = {
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    trend: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    icon: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    trend: 'text-green-600 dark:text-green-400',
  },
  purple: {
    icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    trend: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    icon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    trend: 'text-orange-600 dark:text-orange-400',
  },
  gold: {
    icon: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    trend: 'text-yellow-600 dark:text-yellow-400',
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  className,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card transition-shadow hover:shadow-card-hover',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                'mt-2 text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}% өнгөрсөн сараас
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
