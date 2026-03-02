import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  return time;
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Дөнгөж сая';
  if (diffMins < 60) return `${diffMins} минутын өмнө`;
  if (diffHours < 24) return `${diffHours} цагийн өмнө`;
  if (diffDays < 7) return `${diffDays} өдрийн өмнө`;

  return formatDate(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const roleColors: Record<string, string> = {
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'super-admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

export const statusLabels: Record<string, string> = {
  upcoming: 'Удахгүй',
  ongoing: 'Явагдаж байна',
  completed: 'Дууссан',
  cancelled: 'Цуцлагдсан',
};

export const roleLabels: Record<string, string> = {
  user: 'Хэрэглэгч',
  admin: 'Админ',
  'super-admin': 'Супер Админ',
};
