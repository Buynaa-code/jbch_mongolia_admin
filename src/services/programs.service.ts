import api from './api';
import { WeeklyProgram, ProgramItem, CreateProgramItemDto } from '@/types';
import { mockWeeklyProgram } from '@/data/mock';
import { sleep, generateId } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let localProgram: WeeklyProgram = { ...mockWeeklyProgram };

export const programsService = {
  async getWeeklyProgram(): Promise<WeeklyProgram> {
    if (USE_MOCK) {
      await sleep(500);
      return localProgram;
    }

    const response = await api.get<WeeklyProgram>('/programs/weekly');
    return response.data;
  },

  async updateProgram(items: ProgramItem[]): Promise<WeeklyProgram> {
    if (USE_MOCK) {
      await sleep(500);
      localProgram = {
        ...localProgram,
        items: items.map((item, index) => ({ ...item, order: index + 1 })),
        updatedAt: new Date().toISOString(),
      };
      return localProgram;
    }

    const response = await api.put<WeeklyProgram>('/programs/weekly', { items });
    return response.data;
  },

  async addItem(data: CreateProgramItemDto): Promise<ProgramItem> {
    if (USE_MOCK) {
      await sleep(500);
      const newItem: ProgramItem = {
        id: generateId(),
        ...data,
        order: localProgram.items.length + 1,
      };
      localProgram = {
        ...localProgram,
        items: [...localProgram.items, newItem],
        updatedAt: new Date().toISOString(),
      };
      return newItem;
    }

    const response = await api.post<ProgramItem>('/programs/items', data);
    return response.data;
  },

  async updateItem(id: string, data: Partial<CreateProgramItemDto>): Promise<ProgramItem> {
    if (USE_MOCK) {
      await sleep(500);
      const index = localProgram.items.findIndex((item) => item.id === id);
      if (index === -1) throw new Error('Item not found');

      const updatedItem: ProgramItem = {
        ...localProgram.items[index],
        ...data,
      };
      localProgram.items[index] = updatedItem;
      localProgram.updatedAt = new Date().toISOString();
      return updatedItem;
    }

    const response = await api.put<ProgramItem>(`/programs/items/${id}`, data);
    return response.data;
  },

  async deleteItem(id: string): Promise<void> {
    if (USE_MOCK) {
      await sleep(500);
      localProgram = {
        ...localProgram,
        items: localProgram.items.filter((item) => item.id !== id),
        updatedAt: new Date().toISOString(),
      };
      return;
    }

    await api.delete(`/programs/items/${id}`);
  },
};

export default programsService;
