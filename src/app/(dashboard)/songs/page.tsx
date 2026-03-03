'use client';

import React, { useState, useEffect } from 'react';
import { Song } from '@/types';
import { SongFormData } from '@/lib/validations';
import { Button, ConfirmDialog, PageLoader } from '@/components/ui';
import { SongList, SongForm } from '@/components/songs';
import songsService from '@/services/songs.service';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [deleteSong, setDeleteSong] = useState<Song | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setIsLoading(true);
      const data = await songsService.getAll();
      setSongs(data);
    } catch (error) {
      toast.error('Дуунуудыг татахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedSong(null);
    setIsFormOpen(true);
  };

  const handleEdit = (song: Song) => {
    setSelectedSong(song);
    setIsFormOpen(true);
  };

  const handleDelete = (song: Song) => {
    setDeleteSong(song);
  };

  const handleSubmit = async (data: SongFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedSong) {
        await songsService.update(selectedSong.id, data);
        toast.success('Дуу амжилттай шинэчлэгдлээ');
      } else {
        await songsService.create(data);
        toast.success('Дуу амжилттай нэмэгдлээ');
      }
      await fetchSongs();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteSong) return;

    try {
      setIsDeleting(true);
      await songsService.delete(deleteSong.id);
      toast.success('Дуу амжилттай устгагдлаа');
      await fetchSongs();
      setDeleteSong(null);
    } catch (error) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <PageLoader message="Дуунуудыг татаж байна..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Магтаалын дуунууд</h1>
          <p className="page-description">
            Магтаалын дуунуудыг удирдах, үг болон аудио нэмэх
          </p>
        </div>
        <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
          Шинэ дуу нэмэх
        </Button>
      </div>

      {/* Songs Table */}
      <SongList
        songs={songs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Song Form Modal */}
      <SongForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        song={selectedSong}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteSong}
        onClose={() => setDeleteSong(null)}
        onConfirm={handleConfirmDelete}
        title="Дуу устгах"
        message={`"${deleteSong?.title}" дууг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmText="Устгах"
        cancelText="Цуцлах"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
