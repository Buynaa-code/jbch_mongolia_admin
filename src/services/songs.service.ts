import api from './api';
import { Song, CreateSongDto } from '@/types';
import { mockSongs } from '@/data/mock';
import { sleep, generateId } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let localSongs = [...mockSongs];

export const songsService = {
  async getAll(): Promise<Song[]> {
    if (USE_MOCK) {
      await sleep(500);
      return localSongs;
    }

    const response = await api.get<Song[]>('/songs');
    return response.data;
  },

  async getById(id: string): Promise<Song | null> {
    if (USE_MOCK) {
      await sleep(300);
      return localSongs.find((s) => s.id === id) || null;
    }

    const response = await api.get<Song>(`/songs/${id}`);
    return response.data;
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

    const response = await api.post<Song>('/songs', data);
    return response.data;
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

    const response = await api.put<Song>(`/songs/${id}`, data);
    return response.data;
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
