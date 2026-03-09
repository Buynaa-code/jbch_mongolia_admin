'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Loader({ size = 'md', className }: LoaderProps) {
  return (
    <Loader2 className={cn('animate-spin text-primary-600', sizes[size], className)} />
  );
}

export interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Уншиж байна...' }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader size="lg" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{ width, height }}
    />
  );
}

// Table row skeleton
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
        >
          <div className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className={cn('h-4 flex-1', colIndex === 0 && 'max-w-[200px]')}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Card grid skeleton
export interface CardGridSkeletonProps {
  cards?: number;
  columns?: 2 | 3 | 4;
}

export function CardGridSkeleton({ cards = 6, columns = 3 }: CardGridSkeletonProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns])}>
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Skeleton variant="rectangular" className="h-10 w-10" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loader;
