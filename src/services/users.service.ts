import api from './api';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mock';
import { sleep } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let localUsers = [...mockUsers];

export const usersService = {
  async getAll(): Promise<User[]> {
    if (USE_MOCK) {
      await sleep(500);
      return localUsers;
    }

    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getById(id: string): Promise<User | null> {
    if (USE_MOCK) {
      await sleep(300);
      return localUsers.find((u) => u.id === id) || null;
    }

    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateRole(id: string, role: UserRole): Promise<User> {
    if (USE_MOCK) {
      await sleep(500);
      const index = localUsers.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('User not found');

      const updatedUser: User = {
        ...localUsers[index],
        role,
        updatedAt: new Date().toISOString(),
      };
      localUsers[index] = updatedUser;
      return updatedUser;
    }

    const response = await api.put<User>(`/users/${id}/role`, { role });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await sleep(500);
      localUsers = localUsers.filter((u) => u.id !== id);
      return;
    }

    await api.delete(`/users/${id}`);
  },
};

export default usersService;
