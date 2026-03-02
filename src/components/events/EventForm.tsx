'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Event } from '@/types';
import { eventSchema, EventFormData } from '@/lib/validations';
import { Modal, Input, Textarea, Select, Button, FileUpload } from '@/components/ui';
import { eventStatuses } from '@/data/mock';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  event?: Event | null;
  isLoading?: boolean;
}

export function EventForm({
  isOpen,
  onClose,
  onSubmit,
  event,
  isLoading = false,
}: EventFormProps) {
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      location: '',
      status: 'upcoming',
    },
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        endTime: event.endTime || '',
        location: event.location,
        status: event.status,
        image: event.image,
      });
    } else {
      reset({
        title: '',
        description: '',
        date: '',
        time: '',
        endTime: '',
        location: '',
        status: 'upcoming',
      });
    }
  }, [event, reset]);

  const handleFormSubmit = async (data: EventFormData) => {
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
      title={isEditing ? 'Үйл явдал засах' : 'Шинэ үйл явдал'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="form-grid">
          <div className="form-full">
            <Input
              label="Гарчиг"
              placeholder="Үйл явдлын нэр"
              {...register('title')}
              error={errors.title?.message}
            />
          </div>

          <Input
            label="Огноо"
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Эхлэх цаг"
              type="time"
              {...register('time')}
              error={errors.time?.message}
            />
            <Input
              label="Дуусах цаг"
              type="time"
              {...register('endTime')}
              error={errors.endTime?.message}
            />
          </div>

          <Input
            label="Байршил"
            placeholder="Үйл явдлын газар"
            {...register('location')}
            error={errors.location?.message}
          />

          <Select
            label="Төлөв"
            options={eventStatuses}
            {...register('status')}
            error={errors.status?.message}
          />

          <div className="form-full">
            <Textarea
              label="Тайлбар"
              placeholder="Үйл явдлын дэлгэрэнгүй мэдээлэл"
              rows={4}
              {...register('description')}
              error={errors.description?.message}
            />
          </div>

          <div className="form-full">
            <FileUpload
              label="Зураг (заавал биш)"
              type="image"
              value={watch('image')}
              onChange={(file) => {
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setValue('image', e.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setValue('image', undefined);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleClose}>
            Цуцлах
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Хадгалах' : 'Үүсгэх'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EventForm;
