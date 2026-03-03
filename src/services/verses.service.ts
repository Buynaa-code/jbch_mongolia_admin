import api from './api';
import { Verse, CreateVerseDto } from '@/types';
import { mockVerses } from '@/data/mock';
import { sleep, generateId } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let localVerses = [...mockVerses];

export const versesService = {
  async getAll(): Promise<Verse[]> {
    if (USE_MOCK) {
      await sleep(500);
      return localVerses;
    }

    const response = await api.get<Verse[]>('/verses');
    return response.data;
  },

  async getById(id: string): Promise<Verse | null> {
    if (USE_MOCK) {
      await sleep(300);
      return localVerses.find((v) => v.id === id) || null;
    }

    const response = await api.get<Verse>(`/verses/${id}`);
    return response.data;
  },

  async create(data: CreateVerseDto): Promise<Verse> {
    if (USE_MOCK) {
      await sleep(500);
      const newVerse: Verse = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      localVerses = [newVerse, ...localVerses];
      return newVerse;
    }

    const response = await api.post<Verse>('/verses', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateVerseDto>): Promise<Verse> {
    if (USE_MOCK) {
      await sleep(500);
      const index = localVerses.findIndex((v) => v.id === id);
      if (index === -1) throw new Error('Verse not found');

      const updatedVerse: Verse = {
        ...localVerses[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localVerses[index] = updatedVerse;
      return updatedVerse;
    }

    const response = await api.put<Verse>(`/verses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await sleep(500);
      localVerses = localVerses.filter((v) => v.id !== id);
      return;
    }

    await api.delete(`/verses/${id}`);
  },
};

export default versesService;
