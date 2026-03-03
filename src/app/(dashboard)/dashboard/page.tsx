'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { StatCard, RecentActivity, WeeklySummary } from '@/components/dashboard';
import {
  mockDashboardStats,
  mockWeeklyProgram,
  mockActivity,
} from '@/data/mock';
import {
  Calendar,
  Music,
  BookOpen,
  Users,
  Plus,
  CalendarPlus,
  MusicIcon,
  BookPlus,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = mockDashboardStats;

  const quickActions = [
    {
      label: 'Үйл явдал нэмэх',
      href: '/events',
      icon: CalendarPlus,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      label: 'Дуу нэмэх',
      href: '/songs',
      icon: MusicIcon,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      label: 'Ишлэл нэмэх',
      href: '/verses',
      icon: BookPlus,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Сайн байна уу, {user?.name?.split(' ')[0] || 'Админ'}!
          </h1>
          <p className="page-description">
            Өнөөдрийн тойм болон удирдлагын самбар
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<action.icon className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Нийт үйл явдал"
          value={stats.totalEvents}
          icon={Calendar}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Магтаалын дуу"
          value={stats.totalSongs}
          icon={Music}
          color="purple"
        />
        <StatCard
          title="Цээжлэх ишлэл"
          value={stats.totalVerses}
          icon={BookOpen}
          color="green"
        />
        <StatCard
          title="Удахгүй болох"
          value={stats.upcomingEvents}
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Summary */}
        <WeeklySummary program={mockWeeklyProgram} />

        {/* Recent Activity */}
        <RecentActivity activities={mockActivity} />
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Энэ долоо хоног</h3>
          <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
          <p className="text-blue-100 mt-1">үйл явдал төлөвлөгдсөн</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Нийт хэрэглэгч</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
          <p className="text-purple-100 mt-1">бүртгэлтэй</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Магтан дуу</h3>
          <p className="text-3xl font-bold">{stats.totalSongs}</p>
          <p className="text-green-100 mt-1">дуу оруулсан</p>
        </div>
      </div>
    </div>
  );
}
