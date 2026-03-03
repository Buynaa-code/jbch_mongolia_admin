'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProgramItem } from '@/types';
import { programItemSchema, ProgramItemFormData } from '@/lib/validations';
import { Modal, Input, Textarea, Button } from '@/components/ui';

interface ProgramItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProgramItemFormData) => Promise<void>;
  item?: ProgramItem | null;
  isLoading?: boolean;
}

export function ProgramItemForm({
  isOpen,
  onClose,
  onSubmit,
  item,
  isLoading = false,
}: ProgramItemFormProps) {
  const isEditing = !!item;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramItemFormData>({
    resolver: zodResolver(programItemSchema),
    defaultValues: {
      time: '',
      title: '',
      description: '',
      leader: '',
      duration: '',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        time: item.time,
        title: item.title,
        description: item.description || '',
        leader: item.leader || '',
        duration: item.duration || '',
      });
    } else {
      reset({
        time: '',
        title: '',
        description: '',
        leader: '',
        duration: '',
      });
    }
  }, [item, reset]);

  const handleFormSubmit = async (data: ProgramItemFormData) => {
    await onSubmit(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Хөтөлбөрийн зүйл засах' : 'Шинэ зүйл нэмэх'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="form-grid">
          <Input
            label="Цаг"
            type="time"
            {...register('time')}
            error={errors.time?.message}
          />

          <Input
            label="Хугацаа"
            placeholder="жнь: 15 мин"
            {...register('duration')}
            error={errors.duration?.message}
          />

          <div className="form-full">
            <Input
              label="Гарчиг"
              placeholder="Хөтөлбөрийн зүйлийн нэр"
              {...register('title')}
              error={errors.title?.message}
            />
          </div>

          <div className="form-full">
            <Input
              label="Удирдагч"
              placeholder="Хэн удирдах вэ?"
              {...register('leader')}
              error={errors.leader?.message}
            />
          </div>

          <div className="form-full">
            <Textarea
              label="Тайлбар (заавал биш)"
              placeholder="Нэмэлт мэдээлэл..."
              rows={3}
              {...register('description')}
              error={errors.description?.message}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleClose}>
            Цуцлах
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Хадгалах' : 'Нэмэх'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProgramItemForm;
