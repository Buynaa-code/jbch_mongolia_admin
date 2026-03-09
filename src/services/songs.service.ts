import api from './api';
import { Song, CreateSongDto } from '@/types';
import { mockSongs } from '@/data/mock';
import { sleep, generateId } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let localSongs = [...mockSongs];

// Parse duration string "4:30" to seconds
const parseDuration = (duration?: string): number | null => {
  if (!duration) return null;
  const parts = duration.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return null;
};

// Format seconds to "4:30" string
const formatDuration = (seconds?: number | null): string => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Transform admin panel format to backend API format
const transformToApiFormat = (data: CreateSongDto) => {
  const { category, duration, ...rest } = data as CreateSongDto & {
    category?: string;
    duration?: string;
  };

  return {
    ...rest,
    genre: category || 'worship',
    duration: parseDuration(duration),
  };
};

// Transform backend API format to admin panel format
const transformFromApiFormat = (song: Record<string, unknown>): Song => {
  return {
    id: (song._id || song.id) as string,
    title: song.title as string,
    artist: song.artist as string,
    lyrics: song.lyrics as string,
    category: (song.genre || '') as string,
    duration: formatDuration(song.duration as number | null),
    audioUrl: song.audioUrl as string | undefined,
    tags: song.tags as string[] | undefined,
    createdAt: song.createdAt as string,
    updatedAt: song.updatedAt as string,
  };
};

export const songsService = {
  async getAll(): Promise<Song[]> {
    if (USE_MOCK) {
      await sleep(500);
      return localSongs;
    }

    const response = await api.get<Record<string, unknown>[]>('/songs');
    return response.data.map(transformFromApiFormat);
  },

  async getById(id: string): Promise<Song | null> {
    if (USE_MOCK) {
      await sleep(300);
      return localSongs.find((s) => s.id === id) || null;
    }

    const response = await api.get<Record<string, unknown>>(`/songs/${id}`);
    return response.data ? transformFromApiFormat(response.data) : null;
  },

  async create(data: CreateSongDto): Promise<Song> {
    if (USE_MOCK) {
      await sleep(500);
      const newSong: Song = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      localSongs = [newSong, ...localSongs];
      return newSong;
    }

    const apiData = transformToApiFormat(data);
    const response = await api.post<Record<string, unknown>>('/songs', apiData);
    return transformFromApiFormat(response.data);
  },

  async update(id: string, data: Partial<CreateSongDto>): Promise<Song> {
    if (USE_MOCK) {
      await sleep(500);
      const index = localSongs.findIndex((s) => s.id === id);
      if (index === -1) throw new Error('Song not found');

      const updatedSong: Song = {
        ...localSongs[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localSongs[index] = updatedSong;
      return updatedSong;
    }

    const apiData = transformToApiFormat(data as CreateSongDto);
    const response = await api.put<Record<string, unknown>>(`/songs/${id}`, apiData);
    return transformFromApiFormat(response.data);
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await sleep(500);
      localSongs = localSongs.filter((s) => s.id !== id);
      return;
    }

    await api.delete(`/songs/${id}`);
  },
};

export default songsService;
