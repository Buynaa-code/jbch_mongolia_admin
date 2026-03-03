'use client';

import React, { useState, useEffect } from 'react';
import { Verse } from '@/types';
import { VerseFormData } from '@/lib/validations';
import { Button, ConfirmDialog, PageLoader } from '@/components/ui';
import { VerseList, VerseForm } from '@/components/verses';
import versesService from '@/services/verses.service';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function VersesPage() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [deleteVerse, setDeleteVerse] = useState<Verse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchVerses();
  }, []);

  const fetchVerses = async () => {
    try {
      setIsLoading(true);
      const data = await versesService.getAll();
      setVerses(data);
    } catch (error) {
      toast.error('Ишлэлүүдийг татахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

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
      await fetchVerses();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу.');
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
      await fetchVerses();
      setDeleteVerse(null);
    } catch (error) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setIsDeleting(false);
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
    </div>
  );
}
