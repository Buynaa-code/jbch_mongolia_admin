'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Verse } from '@/types';
import { verseSchema, VerseFormData } from '@/lib/validations';
import { Modal, Input, Textarea, Select, Button } from '@/components/ui';
import { verseCategories } from '@/data/mock';

interface VerseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VerseFormData) => Promise<void>;
  verse?: Verse | null;
  isLoading?: boolean;
}

export function VerseForm({
  isOpen,
  onClose,
  onSubmit,
  verse,
  isLoading = false,
}: VerseFormProps) {
  const isEditing = !!verse;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerseFormData>({
    resolver: zodResolver(verseSchema),
    defaultValues: {
      text: '',
      reference: '',
      category: '',
      translation: '',
    },
  });

  useEffect(() => {
    if (verse) {
      reset({
        text: verse.text,
        reference: verse.reference,
        category: verse.category,
        translation: verse.translation || '',
      });
    } else {
      reset({
        text: '',
        reference: '',
        category: '',
        translation: '',
      });
    }
  }, [verse, reset]);

  const handleFormSubmit = async (data: VerseFormData) => {
    await onSubmit(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const categoryOptions = verseCategories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Ишлэл засах' : 'Шинэ ишлэл нэмэх'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="form-grid">
          <Input
            label="Библийн лавлагаа"
            placeholder="жнь: Иохан 3:16"
            {...register('reference')}
            error={errors.reference?.message}
          />

          <Select
            label="Ангилал"
            placeholder="Ангилал сонгох"
            options={categoryOptions}
            {...register('category')}
            error={errors.category?.message}
          />

          <div className="form-full">
            <Textarea
              label="Ишлэлийн текст"
              placeholder="Библийн ишлэлийг оруулна уу..."
              rows={4}
              {...register('text')}
              error={errors.text?.message}
            />
          </div>

          <div className="form-full">
            <Input
              label="Орчуулга (заавал биш)"
              placeholder="жнь: АВБЭ 2004"
              {...register('translation')}
              error={errors.translation?.message}
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

export default VerseForm;
