'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { Church, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card variant="elevated" padding="lg">
        <CardContent>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
              <Church className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Сүмийн Админ
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Удирдах самбарт нэвтрэх
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="И-мэйл"
              type="email"
              placeholder="admin@church.com"
              {...register('email')}
              error={errors.email?.message}
              leftIcon={<Mail className="h-5 w-5" />}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Нууц үг"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                leftIcon={<Lock className="h-5 w-5" />}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Нэвтрэх
            </Button>
          </form>

          {/* Test credentials hint */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Туршилтын нэвтрэх мэдээлэл:
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>
                <span className="font-medium">Админ:</span> admin@church.com / admin123
              </p>
              <p>
                <span className="font-medium">Супер Админ:</span> super@church.com / super123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
