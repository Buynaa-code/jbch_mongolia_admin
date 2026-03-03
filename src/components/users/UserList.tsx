'use client';

import React from 'react';
import { User, Column, UserRole } from '@/types';
import { cn, formatDate, roleColors, roleLabels, getInitials } from '@/lib/utils';
import { Table, Badge, Select } from '@/components/ui';
import { Trash2, Mail, Phone, Shield } from 'lucide-react';

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  onRoleChange: (user: User, newRole: UserRole) => void;
  onDelete: (user: User) => void;
  currentUserId?: string;
}

const roleOptions = [
  { value: 'user', label: 'Хэрэглэгч' },
  { value: 'admin', label: 'Админ' },
  { value: 'super-admin', label: 'Супер Админ' },
];

export function UserList({
  users,
  isLoading = false,
  onRoleChange,
  onDelete,
  currentUserId,
}: UserListProps) {
  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Хэрэглэгч',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
                {getInitials(user.name)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.name}
              {user.id === currentUserId && (
                <span className="ml-2 text-xs text-gray-400">(Та)</span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Утас',
      render: (_, user) => (
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          {user.phone ? (
            <>
              <Phone className="h-4 w-4 text-gray-400" />
              {user.phone}
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Эрх',
      sortable: true,
      width: '180px',
      render: (_, user) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            options={roleOptions}
            value={user.role}
            onChange={(e) => onRoleChange(user, e.target.value as UserRole)}
            disabled={user.id === currentUserId}
            className="min-w-[150px]"
          />
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Бүртгүүлсэн',
      sortable: true,
      render: (_, user) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
  ];

  const actions = (user: User) => (
    <div className="table-actions">
      {user.id !== currentUserId && (
        <button
          onClick={() => onDelete(user)}
          className="action-btn action-btn-delete"
          title="Устгах"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <Table
      data={users}
      columns={columns}
      searchable
      searchKeys={['name', 'email', 'phone']}
      pagination
      pageSize={10}
      isLoading={isLoading}
      actions={actions}
      emptyMessage="Хэрэглэгч олдсонгүй"
    />
  );
}

export default UserList;
