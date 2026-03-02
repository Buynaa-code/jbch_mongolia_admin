import api from './api';
import { LoginCredentials, LoginResponse, User } from '@/types';
import { mockUsers, mockCredentials } from '@/data/mock';
import { sleep } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (USE_MOCK) {
      await sleep(800); // Simulate network delay

      // Check mock credentials
      if (
        credentials.email === mockCredentials.admin.email &&
        credentials.password === mockCredentials.admin.password
      ) {
        const user = mockUsers.find((u) => u.email === credentials.email);
        if (user) {
          return {
            user,
            token: 'mock-jwt-token-admin-' + Date.now(),
          };
        }
      }

      if (
        credentials.email === mockCredentials.superAdmin.email &&
        credentials.password === mockCredentials.superAdmin.password
      ) {
        const user = mockUsers.find((u) => u.email === credentials.email);
        if (user) {
          return {
            user,
            token: 'mock-jwt-token-super-' + Date.now(),
          };
        }
      }

      throw new Error('И-мэйл эсвэл нууц үг буруу байна');
    }

    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await sleep(300);
      return;
    }

    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      await sleep(300);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      throw new Error('No user found');
    }

    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<string> {
    if (USE_MOCK) {
      await sleep(300);
      return 'mock-refreshed-token-' + Date.now();
    }

    const response = await api.post<{ token: string }>('/auth/refresh');
    return response.data.token;
  },

  // Check if user has required role
  hasRole(user: User | null, requiredRoles: string[]): boolean {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  },

  // Check if user is super admin
  isSuperAdmin(user: User | null): boolean {
    return user?.role === 'super-admin';
  },

  // Check if user is at least admin
  isAdmin(user: User | null): boolean {
    return user?.role === 'admin' || user?.role === 'super-admin';
  },
};

export default authService;
