'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { constructDownloadUrl, convertFileSize } from '@/lib/utils';

type Document = {
  $collectionId?: string;
  $createdAt?: string;
  $databaseId?: string;
  $id?: string;
  $permissions?: string[];
  $updatedAt?: string;
  accountId: string;
  bucketFileId: string;
  extension?: string;
  name: string;
  owners?: string[] | null;
  size?: number;
  type: string;
  url: string;
  users?: string[];
};

interface ImageViewerProps {
  file: Document;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageViewer = ({ file, isOpen, onOpenChange }: ImageViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[60vw] p-0 gap-0 overflow-hidden bg-white border border-light-200/80 text-light-100 rounded-[20px] shadow-drop-2 flex flex-col justify-between">
        <DialogHeader className="p-4 bg-light-400/50 border-b border-light-200/60 flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5 text-left max-w-[80%]">
            <DialogTitle className="text-base font-semibold truncate text-light-100">
              {file.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Preview of {file.name}
            </DialogDescription>
            <p className="text-xs text-light-200">
              {convertFileSize(file.size || 0)}
            </p>
          </div>
          {/* Spacing for close button in dialog content */}
          <div className="w-8 h-8" />
        </DialogHeader>

        <div className="relative flex-1 min-h-[40vh] max-h-[70vh] flex items-center justify-center p-6 bg-light-400/10">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-[60vh] object-contain rounded-md shadow-drop-1 select-none transition-all duration-300 hover:scale-[1.01]"
          />
        </div>

        <div className="p-4 bg-light-400/50 border-t border-light-200/60 flex justify-between items-center gap-4">
          <p className="text-xs text-light-200">
            Format: <span className="uppercase text-light-100 font-semibold">{file.extension}</span>
          </p>
          <a
            href={constructDownloadUrl(file.bucketFileId)}
            download={file.name}
            className="flex items-center gap-2 px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-100 transition-all duration-200 shadow-md hover:shadow-brand/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={20}
              height={20}
              className="brightness-0 invert"
            />
            Download
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
