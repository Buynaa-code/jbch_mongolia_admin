import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'И-мэйл хаяг оруулна уу')
    .email('И-мэйл хаяг буруу байна'),
  password: z
    .string()
    .min(1, 'Нууц үг оруулна уу')
    .min(6, 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'),
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Гарчиг оруулна уу').max(100, 'Гарчиг хэт урт байна'),
  description: z.string().min(1, 'Тайлбар оруулна уу'),
  date: z.string().min(1, 'Огноо сонгоно уу'),
  time: z.string().min(1, 'Цаг оруулна уу'),
  endTime: z.string().optional(),
  location: z.string().min(1, 'Байршил оруулна уу'),
  image: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
});

export const songSchema = z.object({
  title: z.string().min(1, 'Дууны нэр оруулна уу'),
  artist: z.string().min(1, 'Дуучин/баг оруулна уу'),
  lyrics: z.string().min(1, 'Үгийг оруулна уу'),
  audioUrl: z.string().optional(),
  duration: z.string().optional(),
  category: z.string().min(1, 'Ангилал сонгоно уу'),
  tags: z.array(z.string()).optional(),
});

export const verseSchema = z.object({
  text: z.string().min(1, 'Ишлэлийн текст оруулна уу'),
  reference: z.string().min(1, 'Библийн лавлагаа оруулна уу (жнь: Иохан 3:16)'),
  category: z.string().min(1, 'Ангилал сонгоно уу'),
  translation: z.string().optional(),
});

export const programItemSchema = z.object({
  time: z.string().min(1, 'Цаг оруулна уу'),
  title: z.string().min(1, 'Гарчиг оруулна уу'),
  description: z.string().optional(),
  leader: z.string().optional(),
  duration: z.string().optional(),
});

export const userRoleSchema = z.object({
  role: z.enum(['user', 'admin', 'super-admin']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type SongFormData = z.infer<typeof songSchema>;
export type VerseFormData = z.infer<typeof verseSchema>;
export type ProgramItemFormData = z.infer<typeof programItemSchema>;
export type UserRoleFormData = z.infer<typeof userRoleSchema>;
