'use client';

import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventFormData } from '@/lib/validations';
import { Button, ConfirmDialog, PageLoader } from '@/components/ui';
import { EventList, EventForm } from '@/components/events';
import eventsService from '@/services/events.service';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error) {
      toast.error('Үйл явдлуудыг татахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = (event: Event) => {
    setDeleteEvent(event);
  };

  const handleSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedEvent) {
        await eventsService.update(selectedEvent.id, data);
        toast.success('Үйл явдал амжилттай шинэчлэгдлээ');
      } else {
        await eventsService.create(data);
        toast.success('Үйл явдал амжилттай үүсгэгдлээ');
      }
      await fetchEvents();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteEvent) return;

    try {
      setIsDeleting(true);
      await eventsService.delete(deleteEvent.id);
      toast.success('Үйл явдал амжилттай устгагдлаа');
      await fetchEvents();
      setDeleteEvent(null);
    } catch (error) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <PageLoader message="Үйл явдлуудыг татаж байна..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Үйл явдлууд</h1>
          <p className="page-description">
            Сүмийн үйл явдлуудыг удирдах, нэмэх, засах
          </p>
        </div>
        <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
          Шинэ үйл явдал
        </Button>
      </div>

      {/* Events Table */}
      <EventList
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Event Form Modal */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        event={selectedEvent}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteEvent}
        onClose={() => setDeleteEvent(null)}
        onConfirm={handleConfirmDelete}
        title="Үйл явдал устгах"
        message={`"${deleteEvent?.title}" үйл явдлыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmText="Устгах"
        cancelText="Цуцлах"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
