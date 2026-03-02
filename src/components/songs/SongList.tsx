'use client';

import React, { useState } from 'react';
import { Song, Column } from '@/types';
import { truncateText } from '@/lib/utils';
import { Table, Badge, Button, Modal } from '@/components/ui';
import { Pencil, Trash2, Eye, Music, Play, Pause } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  isLoading?: boolean;
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
}

export function SongList({
  songs,
  isLoading = false,
  onEdit,
  onDelete,
}: SongListProps) {
  const [viewSong, setViewSong] = useState<Song | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayPause = (song: Song) => {
    if (!song.audioUrl) return;

    if (playingId === song.id) {
      setPlayingId(null);
      // In real implementation, would pause the audio
    } else {
      setPlayingId(song.id);
      // In real implementation, would play the audio
    }
  };

  const columns: Column<Song>[] = [
    {
      key: 'title',
      label: 'Дууны нэр',
      sortable: true,
      render: (_, song) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {song.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {song.artist}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Ангилал',
      sortable: true,
      render: (_, song) => (
        <Badge variant="info">{song.category}</Badge>
      ),
    },
    {
      key: 'duration',
      label: 'Хугацаа',
      render: (_, song) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {song.duration || '-'}
        </span>
      ),
    },
    {
      key: 'lyrics',
      label: 'Үг',
      render: (_, song) => (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {truncateText(song.lyrics.replace(/\n/g, ' '), 60)}
        </p>
      ),
    },
    {
      key: 'audioUrl',
      label: 'Аудио',
      render: (_, song) => (
        song.audioUrl ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause(song);
            }}
            className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 transition-colors"
          >
            {playingId === song.id ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      ),
    },
  ];

  const actions = (song: Song) => (
    <div className="table-actions">
      <button
        onClick={() => setViewSong(song)}
        className="action-btn action-btn-view"
        title="Харах"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => onEdit(song)}
        className="action-btn action-btn-edit"
        title="Засах"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(song)}
        className="action-btn action-btn-delete"
        title="Устгах"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <>
      <Table
        data={songs}
        columns={columns}
        searchable
        searchKeys={['title', 'artist', 'lyrics', 'category']}
        pagination
        pageSize={10}
        isLoading={isLoading}
        actions={actions}
        emptyMessage="Дуу олдсонгүй"
      />

      {/* Song View Modal */}
      <Modal
        isOpen={!!viewSong}
        onClose={() => setViewSong(null)}
        title={viewSong?.title || 'Дуу'}
        size="lg"
      >
        {viewSong && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Music className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {viewSong.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {viewSong.artist}
                </p>
              </div>
              <Badge variant="info" className="ml-auto">
                {viewSong.category}
              </Badge>
            </div>

            {viewSong.audioUrl && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Аудио
                </label>
                <audio controls src={viewSong.audioUrl} className="w-full" />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Үг
              </label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-h-[300px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                  {viewSong.lyrics}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setViewSong(null)}>
                Хаах
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default SongList;
