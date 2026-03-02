import { ReactNode } from 'react';

// User types
export type UserRole = 'user' | 'admin' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Event types
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  image?: string;
  status: EventStatus;
  attendees?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  image?: string;
  status?: EventStatus;
}

// Song types
export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  audioUrl?: string;
  duration?: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSongDto {
  title: string;
  artist: string;
  lyrics: string;
  audioUrl?: string;
  duration?: string;
  category: string;
  tags?: string[];
}

// Verse types
export interface Verse {
  id: string;
  text: string;
  reference: string;
  category: string;
  translation?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVerseDto {
  text: string;
  reference: string;
  category: string;
  translation?: string;
}

// Weekly Program types
export interface ProgramItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  leader?: string;
  duration?: string;
  order: number;
}

export interface WeeklyProgram {
  id: string;
  date: string;
  items: ProgramItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProgramItemDto {
  time: string;
  title: string;
  description?: string;
  leader?: string;
  duration?: string;
  order: number;
}

// Dashboard types
export interface DashboardStats {
  totalEvents: number;
  totalSongs: number;
  totalVerses: number;
  totalUsers: number;
  upcomingEvents: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'event' | 'song' | 'verse' | 'user' | 'program';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  user: string;
  timestamp: string;
}

// API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Table types
export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => ReactNode;
  width?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Form types
export interface SelectOption {
  value: string;
  label: string;
}
