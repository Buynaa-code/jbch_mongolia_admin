'use client';

import React, { useState, useCallback } from 'react';
import { Verse } from '@/types';
import { VerseFormData } from '@/lib/validations';
import { Button, ConfirmDialog, PageLoader } from '@/components/ui';
import { VerseList, VerseForm } from '@/components/verses';
import versesService from '@/services/verses.service';
import { getErrorMessage } from '@/lib/errors';
import { useAsyncData } from '@/hooks';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function VersesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [deleteVerse, setDeleteVerse] = useState<Verse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [verseOfWeekTarget, setVerseOfWeekTarget] = useState<Verse | null>(null);
  const [isSettingVerseOfWeek, setIsSettingVerseOfWeek] = useState(false);

  // Fetch verses with automatic abort on unmount
  const fetchVerses = useCallback(() => versesService.getAll(), []);
  const { data: verses = [], isLoading, refetch } = useAsyncData(fetchVerses);

  const handleCreate = () => {
    setSelectedVerse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (verse: Verse) => {
    setSelectedVerse(verse);
    setIsFormOpen(true);
  };

  const handleDelete = (verse: Verse) => {
    setDeleteVerse(verse);
  };

  const handleSubmit = async (data: VerseFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedVerse) {
        await versesService.update(selectedVerse.id, data);
        toast.success('Ишлэл амжилттай шинэчлэгдлээ');
      } else {
        await versesService.create(data);
        toast.success('Ишлэл амжилттай нэмэгдлээ');
      }
      await refetch();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteVerse) return;

    try {
      setIsDeleting(true);
      await versesService.delete(deleteVerse.id);
      toast.success('Ишлэл амжилттай устгагдлаа');
      await refetch();
      setDeleteVerse(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetVerseOfWeek = (verse: Verse) => {
    setVerseOfWeekTarget(verse);
  };

  const handleConfirmVerseOfWeek = async () => {
    if (!verseOfWeekTarget) return;

    try {
      setIsSettingVerseOfWeek(true);
      await versesService.setVerseOfWeek(verseOfWeekTarget.id, new Date());
      toast.success('Долоо хоногийн ишлэл амжилттай тохируулагдлаа');
      await refetch();
      setVerseOfWeekTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSettingVerseOfWeek(false);
    }
  };

  if (isLoading) {
    return <PageLoader message="Ишлэлүүдийг татаж байна..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Цээжлэх ишлэлүүд</h1>
          <p className="page-description">
            Библийн цээжлэх ишлэлүүдийг удирдах, нэмэх
          </p>
        </div>
        <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
          Шинэ ишлэл нэмэх
        </Button>
      </div>

      {/* Verses List */}
      <VerseList
        verses={verses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetVerseOfWeek={handleSetVerseOfWeek}
      />

      {/* Verse Form Modal */}
      <VerseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        verse={selectedVerse}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteVerse}
        onClose={() => setDeleteVerse(null)}
        onConfirm={handleConfirmDelete}
        title="Ишлэл устгах"
        message={`"${deleteVerse?.reference}" ишлэлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmText="Устгах"
        cancelText="Цуцлах"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Set Verse of Week Confirmation */}
      <ConfirmDialog
        isOpen={!!verseOfWeekTarget}
        onClose={() => setVerseOfWeekTarget(null)}
        onConfirm={handleConfirmVerseOfWeek}
        title="Долоо хоногийн ишлэл"
        message={`"${verseOfWeekTarget?.reference}" ишлэлийг энэ долоо хоногийн ишлэл болгох уу?`}
        confirmText="Тохируулах"
        cancelText="Цуцлах"
        variant="info"
        isLoading={isSettingVerseOfWeek}
      />
    </div>
  );
}
