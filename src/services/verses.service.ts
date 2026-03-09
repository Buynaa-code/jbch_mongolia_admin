import api from './api';
import { Verse, CreateVerseDto } from '@/types';
import { mockVerses } from '@/data/mock';
import { sleep, generateId } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let localVerses = [...mockVerses];

// Parse reference like "Иохан 3:16" or "Иохан 3:16-18"
const parseReference = (reference: string) => {
  // Match pattern: Book Chapter:VerseStart(-VerseEnd)?
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (match) {
    return {
      book: match[1].trim(),
      chapter: parseInt(match[2], 10),
      verseStart: parseInt(match[3], 10),
      verseEnd: match[4] ? parseInt(match[4], 10) : null,
    };
  }
  // Fallback
  return { book: reference, chapter: 1, verseStart: 1, verseEnd: null };
};

// Transform admin panel format to backend API format
const transformToApiFormat = (data: CreateVerseDto) => {
  const { reference, category, translation, ...rest } = data as CreateVerseDto & {
    reference?: string;
    category?: string;
    translation?: string;
  };

  const parsed = reference ? parseReference(reference) : { book: '', chapter: 1, verseStart: 1, verseEnd: null };

  return {
    ...rest,
    reference: reference || '',
    book: parsed.book,
    chapter: parsed.chapter,
    verseStart: parsed.verseStart,
    verseEnd: parsed.verseEnd,
    theme: category || 'faith',
    textMongolian: translation || '',
  };
};

// Transform backend API format to admin panel format
const transformFromApiFormat = (verse: Record<string, unknown>): Verse => {
  return {
    id: (verse._id || verse.id) as string,
    reference: verse.reference as string,
    text: verse.text as string,
    category: (verse.theme || '') as string,
    translation: (verse.textMongolian || '') as string,
    isVerseOfWeek: verse.isVerseOfWeek as boolean,
    weekOf: verse.weekOf as string | undefined,
    createdAt: verse.createdAt as string,
    updatedAt: verse.updatedAt as string,
  };
};

export const versesService = {
  async getAll(): Promise<Verse[]> {
    if (USE_MOCK) {
      await sleep(500);
      return localVerses;
    }

    const response = await api.get<Record<string, unknown>[]>('/verses');
    return response.data.map(transformFromApiFormat);
  },

  async getById(id: string): Promise<Verse | null> {
    if (USE_MOCK) {
      await sleep(300);
      return localVerses.find((v) => v.id === id) || null;
    }

    const response = await api.get<Record<string, unknown>>(`/verses/${id}`);
    return response.data ? transformFromApiFormat(response.data) : null;
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

    const apiData = transformToApiFormat(data);
    const response = await api.post<Record<string, unknown>>('/verses', apiData);
    return transformFromApiFormat(response.data);
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

    const apiData = transformToApiFormat(data as CreateVerseDto);
    const response = await api.put<Record<string, unknown>>(`/verses/${id}`, apiData);
    return transformFromApiFormat(response.data);
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await sleep(500);
      localVerses = localVerses.filter((v) => v.id !== id);
      return;
    }

    await api.delete(`/verses/${id}`);
  },

  async setVerseOfWeek(id: string, weekOf: Date): Promise<Verse> {
    if (USE_MOCK) {
      await sleep(500);
      // Clear previous verse of week
      localVerses = localVerses.map((v) => ({
        ...v,
        isVerseOfWeek: false,
        weekOf: undefined,
      }));
      // Set new verse of week
      const index = localVerses.findIndex((v) => v.id === id);
      if (index === -1) throw new Error('Verse not found');

      const updatedVerse: Verse = {
        ...localVerses[index],
        isVerseOfWeek: true,
        weekOf: weekOf.toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localVerses[index] = updatedVerse;
      return updatedVerse;
    }

    const response = await api.put<Record<string, unknown>>(`/verses/${id}/set-verse-of-week`, {
      weekOf: weekOf.toISOString(),
    });
    return transformFromApiFormat(response.data);
  },
};

export default versesService;
