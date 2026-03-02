import api from './api';
import { Event, CreateEventDto } from '@/types';
import { mockEvents } from '@/data/mock';
import { sleep, generateId } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Local mock data storage
let localEvents = [...mockEvents];

export const eventsService = {
  async getAll(): Promise<Event[]> {
    if (USE_MOCK) {
      await sleep(500);
      return localEvents;
    }

    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  async getById(id: string): Promise<Event | null> {
    if (USE_MOCK) {
      await sleep(300);
      return localEvents.find((e) => e.id === id) || null;
    }

    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  async create(data: CreateEventDto): Promise<Event> {
    if (USE_MOCK) {
      await sleep(500);
      const newEvent: Event = {
        id: generateId(),
        ...data,
        status: data.status || 'upcoming',
        createdAt: new Date().toISOString(),
      };
      localEvents = [newEvent, ...localEvents];
      return newEvent;
    }

    const response = await api.post<Event>('/events', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateEventDto>): Promise<Event> {
    if (USE_MOCK) {
      await sleep(500);
      const index = localEvents.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Event not found');

      const updatedEvent: Event = {
        ...localEvents[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localEvents[index] = updatedEvent;
      return updatedEvent;
    }

    const response = await api.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await sleep(500);
      localEvents = localEvents.filter((e) => e.id !== id);
      return;
    }

    await api.delete(`/events/${id}`);
  },
};

export default eventsService;
