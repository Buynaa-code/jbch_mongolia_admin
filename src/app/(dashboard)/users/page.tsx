'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmDialog, PageLoader, Card, CardContent } from '@/components/ui';
import { UserList } from '@/components/users';
import usersService from '@/services/users.service';
import toast from 'react-hot-toast';
import { Users, Shield, UserCheck } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not super admin
  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error('Танд энэ хуудсанд хандах эрх байхгүй');
      router.replace('/dashboard');
    }
  }, [isSuperAdmin, router]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Хэрэглэгчдийг татахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (user: User, newRole: UserRole) => {
    try {
      await usersService.updateRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      toast.success(`${user.name}-ийн эрх амжилттай өөрчлөгдлөө`);
    } catch (error) {
      toast.error('Эрх өөрчлөхөд алдаа гарлаа');
    }
  };

  const handleDelete = (user: User) => {
    setDeleteUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUser) return;

    try {
      setIsDeleting(true);
      await usersService.delete(deleteUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      toast.success('Хэрэглэгч амжилттай устгагдлаа');
      setDeleteUser(null);
    } catch (error) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  if (isLoading) {
    return <PageLoader message="Хэрэглэгчдийг татаж байна..." />;
  }

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const superAdminCount = users.filter((u) => u.role === 'super-admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Хэрэглэгчид</h1>
          <p className="page-description">
            Хэрэглэгчдийн эрхийг удирдах (Зөвхөн Супер Админ)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="sm">
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Нийт хэрэглэгч</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card padding="sm">
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Админ</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {adminCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card padding="sm">
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Супер Админ</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {superAdminCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <UserList
        users={users}
        onRoleChange={handleRoleChange}
        onDelete={handleDelete}
        currentUserId={currentUser?.id}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleConfirmDelete}
        title="Хэрэглэгч устгах"
        message={`"${deleteUser?.name}" хэрэглэгчийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmText="Устгах"
        cancelText="Цуцлах"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
