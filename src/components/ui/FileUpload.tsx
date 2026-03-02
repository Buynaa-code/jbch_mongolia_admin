'use client';

import React, { useState, useRef, useCallback, ChangeEvent, DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, Music, File } from 'lucide-react';
import Button from './Button';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  onChange: (file: File | null) => void;
  value?: string | null;
  error?: string;
  helperText?: string;
  type?: 'image' | 'audio' | 'file';
  className?: string;
}

export function FileUpload({
  label,
  accept,
  maxSize = 10,
  onChange,
  value,
  error,
  helperText,
  type = 'file',
  className,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Файлын хэмжээ ${maxSize}MB-аас хэтрэхгүй байх ёстой`);
        return;
      }

      setFileName(file.name);
      onChange(file);

      // Create preview for images
      if (type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'audio' && file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    },
    [maxSize, onChange, type]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-10 w-10 text-gray-400" />;
      case 'audio':
        return <Music className="h-10 w-10 text-gray-400" />;
      default:
        return <File className="h-10 w-10 text-gray-400" />;
    }
  };

  const getAccept = () => {
    if (accept) return accept;
    switch (type) {
      case 'image':
        return 'image/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*/*';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}

      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          error && 'border-red-500'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={getAccept()}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="flex flex-col items-center gap-3">
            {type === 'image' && (
              <img
                src={preview}
                alt="Preview"
                className="max-h-40 rounded-lg object-contain"
              />
            )}
            {type === 'audio' && (
              <audio controls src={preview} className="w-full max-w-sm" />
            )}
            {type === 'file' && (
              <div className="flex items-center gap-2">
                <File className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {fileName}
                </span>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              leftIcon={<X className="h-4 w-4" />}
            >
              Арилгах
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            {getIcon()}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  Файл сонгох
                </span>{' '}
                эсвэл чирж оруулна уу
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {type === 'image' && 'PNG, JPG, GIF - '}
                {type === 'audio' && 'MP3, WAV, OGG - '}
                Хамгийн ихдээ {maxSize}MB
              </p>
            </div>
            <Upload className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={cn(
            'mt-1.5 text-sm',
            error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
