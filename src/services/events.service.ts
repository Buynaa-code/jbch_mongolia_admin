import api from './api';
import { Event, CreateEventDto } from '@/types';
import { mockEvents } from '@/data/mock';
import { sleep, generateId } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Local mock data storage
let localEvents = [...mockEvents];

// Transform admin panel format to backend API format
const transformToApiFormat = (data: CreateEventDto) => {
  const { date, time, endTime, location, ...rest } = data as CreateEventDto & { date?: string; time?: string; endTime?: string };

  // Combine date and time into ISO dates
  const startDate = date && time ? new Date(`${date}T${time}:00`).toISOString() : new Date().toISOString();
  const endDate = date && endTime ? new Date(`${date}T${endTime}:00`).toISOString() : startDate;

  return {
    ...rest,
    startDate,
    endDate,
    location: typeof location === 'string' ? { name: location, address: '' } : location,
  };
};

// Transform backend API format to admin panel format
const transformFromApiFormat = (event: Record<string, unknown>): Event => {
  const startDate = event.startDate ? new Date(event.startDate as string) : null;
  const endDate = event.endDate ? new Date(event.endDate as string) : null;
  const location = event.location as { name?: string } | undefined;

  return {
    id: (event._id || event.id) as string,
    title: event.title as string,
    description: event.description as string,
    date: startDate ? startDate.toISOString().split('T')[0] : '',
    time: startDate ? startDate.toTimeString().slice(0, 5) : '',
    endTime: endDate ? endDate.toTimeString().slice(0, 5) : '',
    location: location?.name || '',
    status: (event.isActive === false ? 'cancelled' : 'upcoming') as Event['status'],
    image: event.image as string | undefined,
    createdAt: event.createdAt as string,
    updatedAt: event.updatedAt as string,
  };
};

export const eventsService = {
  async getAll(): Promise<Event[]> {
    if (USE_MOCK) {
      await sleep(500);
      return localEvents;
    }

    const response = await api.get<Record<string, unknown>[]>('/events');
    return response.data.map(transformFromApiFormat);
  },

  async getById(id: string): Promise<Event | null> {
    if (USE_MOCK) {
      await sleep(300);
      return localEvents.find((e) => e.id === id) || null;
    }

    const response = await api.get<Record<string, unknown>>(`/events/${id}`);
    return response.data ? transformFromApiFormat(response.data) : null;
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

    const apiData = transformToApiFormat(data);
    const response = await api.post<Record<string, unknown>>('/events', apiData);
    return transformFromApiFormat(response.data);
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

    const apiData = transformToApiFormat(data as CreateEventDto);
    const response = await api.put<Record<string, unknown>>(`/events/${id}`, apiData);
    return transformFromApiFormat(response.data);
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
