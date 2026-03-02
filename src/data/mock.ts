import {
  User,
  Event,
  Song,
  Verse,
  WeeklyProgram,
  DashboardStats,
  ActivityItem,
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Админ Хэрэглэгч',
    email: 'admin@church.com',
    role: 'admin',
    phone: '+976 9911 2233',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Супер Админ',
    email: 'super@church.com',
    role: 'super-admin',
    phone: '+976 9922 3344',
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '3',
    name: 'Батбаяр Д.',
    email: 'batbayar@email.com',
    role: 'user',
    createdAt: '2024-02-01T14:30:00Z',
  },
  {
    id: '4',
    name: 'Оюунтуяа Б.',
    email: 'oyuntuyaa@email.com',
    role: 'user',
    createdAt: '2024-02-10T09:15:00Z',
  },
  {
    id: '5',
    name: 'Энхбат Т.',
    email: 'enkhbat@email.com',
    role: 'admin',
    createdAt: '2024-02-15T11:45:00Z',
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Ням гарагийн үйлчлэл',
    description: 'Бүх гишүүдийг урьж байна. Хамтдаа магтан дуулж, үгийг сонсоцгооё.',
    date: '2024-03-10',
    time: '10:00',
    endTime: '12:00',
    location: 'Үндсэн танхим',
    status: 'upcoming',
    attendees: 150,
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Залуучуудын цугларалт',
    description: 'Залуучуудад зориулсан тусгай үйлчлэл. Магтаал, номлол, нөхөрлөл.',
    date: '2024-03-08',
    time: '18:00',
    endTime: '20:00',
    location: '2-р давхар',
    status: 'upcoming',
    attendees: 45,
    createdAt: '2024-02-18T14:00:00Z',
  },
  {
    id: '3',
    title: 'Библи судлал',
    description: 'Долоо хоног бүрийн Библи судлалын цаг. Иохан номыг судалж байна.',
    date: '2024-03-06',
    time: '19:00',
    endTime: '20:30',
    location: 'Цахим (Zoom)',
    status: 'ongoing',
    attendees: 30,
    createdAt: '2024-02-15T09:00:00Z',
  },
  {
    id: '4',
    title: 'Сар шинийн баяр',
    description: 'Цагаан сарын баярыг хамтдаа тэмдэглэсэн.',
    date: '2024-02-10',
    time: '11:00',
    endTime: '14:00',
    location: 'Үндсэн танхим',
    status: 'completed',
    attendees: 200,
    createdAt: '2024-01-20T12:00:00Z',
  },
];

// Mock Songs
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Алдар суу Эзэнд',
    artist: 'Сүмийн магтаалын баг',
    lyrics: `Алдар суу Эзэнд
Тэнгэр газар магтан дуулаг
Бүх амьтан магтаг
Түүний нэрийг өргөмжилье

Хор:
Магтан дуулъя Эзэнээ
Өргөн тавьлаа амьдралаа
Тэр бол хайртай Аврагч
Үүрд мөнхөд магтагдах`,
    category: 'Магтаал',
    duration: '4:30',
    tags: ['магтаал', 'ням гараг'],
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Гайхамшигт Нигүүлсэл',
    artist: 'Сүмийн магтаалын баг',
    lyrics: `Гайхамшигт нигүүлсэл
Намайг авч аварсан
Төөрсөн би олдсон
Сохор би одоо харна

Нигүүлслээр би одоо
Аврагдсан билээ
Итгэлээр би алхна
Тэнгэрийн гэрэл дор`,
    category: 'Магтаал',
    duration: '5:15',
    tags: ['нигүүлсэл', 'сонгодог'],
    createdAt: '2024-01-15T14:00:00Z',
  },
  {
    id: '3',
    title: 'Эзэн миний Хоньчин',
    artist: 'Дуурь 23',
    lyrics: `Эзэн миний хоньчин
Надад дутагдал үгүй
Ногоон бэлчээрт хэвтүүлнэ
Тэр намайг намуун усны дэргэд

Сэтгэлийг минь сэргээнэ
Зөв замаар Тэр удирдана
Үхлийн сүүдэр хөндий дундуур
Гашуудахгүй би`,
    category: 'Дуурь',
    duration: '3:45',
    tags: ['дуурь', 'тайвшрал'],
    createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: '4',
    title: 'Христийн Хайр',
    artist: 'Залуучуудын баг',
    lyrics: `Христийн хайр өндөр
Гүн бөгөөд өргөн
Ямар ч зүйл салгаж чадахгүй
Түүний хайрнаас

Би хайрлагдсан
Би уучлагдсан
Би эдгэрсэн
Христийн хайраар`,
    category: 'Шинэ дуу',
    duration: '4:00',
    tags: ['залуучууд', 'хайр'],
    createdAt: '2024-02-15T16:00:00Z',
  },
];

// Mock Verses
export const mockVerses: Verse[] = [
  {
    id: '1',
    text: 'Учир нь Бурхан ертөнцийг үнэхээр хайрласан тул цорын ганц Хүүгээ өгсөн. Ингэснээр Хүүд итгэгч хэн ч мөхөхгүй, харин мөнх амьтай болох юм.',
    reference: 'Иохан 3:16',
    category: 'Хайр',
    translation: 'АВБЭ 2004',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: '2',
    text: 'Эзэн миний хоньчин, надад дутагдал үгүй.',
    reference: 'Дуулал 23:1',
    category: 'Итгэл',
    translation: 'АВБЭ 2004',
    createdAt: '2024-01-10T11:00:00Z',
  },
  {
    id: '3',
    text: 'Би бол зам, үнэн, амь мөн. Хэн ч Надаар дамжилгүйгээр Эцэгт хүрэхгүй.',
    reference: 'Иохан 14:6',
    category: 'Аврал',
    translation: 'АВБЭ 2004',
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    id: '4',
    text: 'Нигүүлслээр та нар итгэлээрээ аврагдсан бөгөөд энэ нь та нараас биш, Бурханы бэлэг юм.',
    reference: 'Ефес 2:8',
    category: 'Нигүүлсэл',
    translation: 'АВБЭ 2004',
    createdAt: '2024-02-01T14:00:00Z',
  },
  {
    id: '5',
    text: 'Чамаас илүү юу хүсэх билээ, чиний нэрийг хоног бүр дурсах нь миний таашаал.',
    reference: 'Исаиа 26:8',
    category: 'Залбирал',
    translation: 'АВБЭ 2004',
    createdAt: '2024-02-10T08:00:00Z',
  },
];

// Mock Weekly Program
export const mockWeeklyProgram: WeeklyProgram = {
  id: '1',
  date: '2024-03-10',
  items: [
    {
      id: 'p1',
      time: '10:00',
      title: 'Угтах магтаал',
      description: 'Магтан дуулалтаар эхэлнэ',
      leader: 'Магтаалын баг',
      duration: '15 мин',
      order: 1,
    },
    {
      id: 'p2',
      time: '10:15',
      title: 'Нээлтийн залбирал',
      description: 'Хамтын залбирал',
      leader: 'Пастор Б.',
      duration: '10 мин',
      order: 2,
    },
    {
      id: 'p3',
      time: '10:25',
      title: 'Магтан дуулалт',
      description: '3-4 магтаалын дуу',
      leader: 'Магтаалын баг',
      duration: '20 мин',
      order: 3,
    },
    {
      id: 'p4',
      time: '10:45',
      title: 'Зарлал & мэндчилгээ',
      description: 'Сүмийн зарлал, шинэ хүмүүсийг угтах',
      leader: 'Удирдагч Т.',
      duration: '10 мин',
      order: 4,
    },
    {
      id: 'p5',
      time: '10:55',
      title: 'Өргөл цуглуулалт',
      description: 'Аравны нэг ба өргөл',
      leader: 'Тэргүүлэгчид',
      duration: '5 мин',
      order: 5,
    },
    {
      id: 'p6',
      time: '11:00',
      title: 'Үгийн үйлчлэл',
      description: 'Номлол: "Итгэлийн амьдрал"',
      leader: 'Пастор Б.',
      duration: '45 мин',
      order: 6,
    },
    {
      id: 'p7',
      time: '11:45',
      title: 'Хариу үйлдэл & залбирал',
      description: 'Залбирлын дуудлага',
      leader: 'Пастор Б.',
      duration: '10 мин',
      order: 7,
    },
    {
      id: 'p8',
      time: '11:55',
      title: 'Хаалтын магтаал & ерөөл',
      description: 'Төгсгөлийн ерөөл',
      leader: 'Пастор Б.',
      duration: '5 мин',
      order: 8,
    },
  ],
  createdAt: '2024-03-01T10:00:00Z',
  updatedAt: '2024-03-05T14:30:00Z',
};

// Mock Activity
export const mockActivity: ActivityItem[] = [
  {
    id: 'a1',
    type: 'event',
    action: 'created',
    title: 'Ням гарагийн үйлчлэл',
    user: 'Админ',
    timestamp: '2024-03-01T10:30:00Z',
  },
  {
    id: 'a2',
    type: 'song',
    action: 'updated',
    title: 'Алдар суу Эзэнд - lyrics updated',
    user: 'Супер Админ',
    timestamp: '2024-02-28T15:45:00Z',
  },
  {
    id: 'a3',
    type: 'verse',
    action: 'created',
    title: 'Иохан 3:16 нэмэгдсэн',
    user: 'Админ',
    timestamp: '2024-02-27T09:20:00Z',
  },
  {
    id: 'a4',
    type: 'program',
    action: 'updated',
    title: 'Ням гарагийн хөтөлбөр шинэчлэгдсэн',
    user: 'Пастор Б.',
    timestamp: '2024-02-26T14:00:00Z',
  },
  {
    id: 'a5',
    type: 'user',
    action: 'created',
    title: 'Шинэ хэрэглэгч бүртгэгдсэн',
    user: 'Систем',
    timestamp: '2024-02-25T11:30:00Z',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalEvents: mockEvents.length,
  totalSongs: mockSongs.length,
  totalVerses: mockVerses.length,
  totalUsers: mockUsers.length,
  upcomingEvents: mockEvents.filter((e) => e.status === 'upcoming').length,
  recentActivity: mockActivity,
};

// Song categories
export const songCategories = [
  'Магтаал',
  'Дуурь',
  'Шинэ дуу',
  'Залуучуудын',
  'Хүүхдийн',
  'Сонгодог',
];

// Verse categories
export const verseCategories = [
  'Хайр',
  'Итгэл',
  'Аврал',
  'Нигүүлсэл',
  'Залбирал',
  'Амлалт',
  'Тайвшрал',
  'Хүч чадал',
];

// Event statuses
export const eventStatuses = [
  { value: 'upcoming', label: 'Удахгүй' },
  { value: 'ongoing', label: 'Явагдаж байна' },
  { value: 'completed', label: 'Дууссан' },
  { value: 'cancelled', label: 'Цуцлагдсан' },
];

// Mock credentials for testing
export const mockCredentials = {
  admin: { email: 'admin@church.com', password: 'admin123' },
  superAdmin: { email: 'super@church.com', password: 'super123' },
};
