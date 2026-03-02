'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Song } from '@/types';
import { songSchema, SongFormData } from '@/lib/validations';
import { Modal, Input, Textarea, Select, Button, FileUpload } from '@/components/ui';
import { songCategories } from '@/data/mock';

interface SongFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SongFormData) => Promise<void>;
  song?: Song | null;
  isLoading?: boolean;
}

export function SongForm({
  isOpen,
  onClose,
  onSubmit,
  song,
  isLoading = false,
}: SongFormProps) {
  const isEditing = !!song;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: '',
      artist: '',
      lyrics: '',
      category: '',
      duration: '',
    },
  });

  useEffect(() => {
    if (song) {
      reset({
        title: song.title,
        artist: song.artist,
        lyrics: song.lyrics,
        category: song.category,
        duration: song.duration || '',
        audioUrl: song.audioUrl,
        tags: song.tags,
      });
    } else {
      reset({
        title: '',
        artist: '',
        lyrics: '',
        category: '',
        duration: '',
      });
    }
  }, [song, reset]);

  const handleFormSubmit = async (data: SongFormData) => {
    await onSubmit(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const categoryOptions = songCategories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Дуу засах' : 'Шинэ дуу нэмэх'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="form-grid">
          <Input
            label="Дууны нэр"
            placeholder="Дууны гарчиг"
            {...register('title')}
            error={errors.title?.message}
          />

          <Input
            label="Дуучин / Баг"
            placeholder="Хэн дуулсан"
            {...register('artist')}
            error={errors.artist?.message}
          />

          <Select
            label="Ангилал"
            placeholder="Ангилал сонгох"
            options={categoryOptions}
            {...register('category')}
            error={errors.category?.message}
          />

          <Input
            label="Хугацаа"
            placeholder="4:30"
            {...register('duration')}
            error={errors.duration?.message}
          />

          <div className="form-full">
            <Textarea
              label="Үг"
              placeholder="Дууны үгийг оруулна уу..."
              rows={8}
              {...register('lyrics')}
              error={errors.lyrics?.message}
            />
          </div>

          <div className="form-full">
            <FileUpload
              label="Аудио файл (заавал биш)"
              type="audio"
              value={watch('audioUrl')}
              onChange={(file) => {
                if (file) {
                  const url = URL.createObjectURL(file);
                  setValue('audioUrl', url);
                } else {
                  setValue('audioUrl', undefined);
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
            {isEditing ? 'Хадгалах' : 'Нэмэх'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default SongForm;
