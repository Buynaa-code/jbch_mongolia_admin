'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProgramItem, WeeklyProgram } from '@/types';
import { ProgramItemFormData } from '@/lib/validations';
import { ConfirmDialog, PageLoader, Card, CardContent } from '@/components/ui';
import { ProgramEditor, ProgramItemForm } from '@/components/weekly-program';
import programsService from '@/services/programs.service';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

export default function WeeklyProgramPage() {
  const [program, setProgram] = useState<WeeklyProgram | null>(null);
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [originalItems, setOriginalItems] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProgramItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ProgramItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasChanges = JSON.stringify(items) !== JSON.stringify(originalItems);

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {
      setIsLoading(true);
      const data = await programsService.getWeeklyProgram();
      setProgram(data);
      setItems(data.items);
      setOriginalItems(data.items);
    } catch (error) {
      toast.error('Хөтөлбөрийг татахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemsChange = useCallback((newItems: ProgramItem[]) => {
    setItems(newItems);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await programsService.updateProgram(items);
      setOriginalItems(items);
      toast.success('Хөтөлбөр амжилттай хадгалагдлаа');
    } catch (error) {
      toast.error('Хадгалахад алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: ProgramItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: ProgramItem) => {
    setDeleteItem(item);
  };

  const handleSubmitItem = async (data: ProgramItemFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedItem) {
        // Update existing item
        const updatedItem = await programsService.updateItem(selectedItem.id, data);
        setItems((prev) =>
          prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
        );
        setOriginalItems((prev) =>
          prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
        );
        toast.success('Зүйл амжилттай шинэчлэгдлээ');
      } else {
        // Add new item
        const newItem = await programsService.addItem({
          ...data,
          order: items.length + 1,
        });
        setItems((prev) => [...prev, newItem]);
        setOriginalItems((prev) => [...prev, newItem]);
        toast.success('Зүйл амжилттай нэмэгдлээ');
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    try {
      setIsDeleting(true);
      await programsService.deleteItem(deleteItem.id);
      setItems((prev) => prev.filter((item) => item.id !== deleteItem.id));
      setOriginalItems((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast.success('Зүйл амжилттай устгагдлаа');
      setDeleteItem(null);
    } catch (error) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <PageLoader message="Хөтөлбөрийг татаж байна..." />;
  }

  // Calculate total duration
  const totalItems = items.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Долоо хоногийн хөтөлбөр</h1>
          <p className="page-description">
            Ням гарагийн үйлчлэлийн хөтөлбөрийг удирдах
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="sm">
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Огноо</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {program ? formatDate(program.date) : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card padding="sm">
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Нийт зүйл</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {totalItems} зүйл
              </p>
            </div>
          </CardContent>
        </Card>
        <Card padding="sm">
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Эхлэх цаг</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {items[0]?.time || '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Editor */}
      <ProgramEditor
        items={items}
        onChange={handleItemsChange}
        onSave={handleSave}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      {/* Item Form Modal */}
      <ProgramItemForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitItem}
        item={selectedItem}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        title="Зүйл устгах"
        message={`"${deleteItem?.title}" зүйлийг устгахдаа итгэлтэй байна уу?`}
        confirmText="Устгах"
        cancelText="Цуцлах"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
