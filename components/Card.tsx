import Link from 'next/link';
import React, { useState } from 'react';
import Thumbnail from './Thumbnail';
import { convertFileSize } from '@/lib/utils';
import FormatedDateTime from './FormatedDateTime';
import ActionDropdown from './ActionDropdown';
import { ImageViewer } from './ImageViewer';

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

interface CardProps{
    file:Document
}

const Card = ({file}:CardProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const isImage = file.type === "image" && file.extension !== "svg";

  const handleCardClick = (e: React.MouseEvent) => {
    if (isImage) {
      e.preventDefault();
      setIsViewerOpen(true);
    }
  };

  return (
    <>
      <Link 
        href={file.url} 
        target='_blank' 
        onClick={handleCardClick}
        className='file-card group'
      >
          <div className='flex justify-between items-start'>
              <Thumbnail 
                type={file.type} 
                extension={file.extension || ""} 
                url={file.url} 
                className='!size-16 rounded-full shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-drop-1'
                imageClassName='!size-9'
              />
              <div className='flex flex-col items-end justify-between h-16' onClick={(e) => e.stopPropagation()}>
                  <ActionDropdown file={file}/>
                  <p className='body-2 font-medium text-brand bg-brand/10 px-3 py-1 rounded-full'>
                    {convertFileSize(file.size!)}
                  </p> 
              </div>
          </div>
          <div className='file-card-details'>
              <p className='subtitle-2 line-clamp-1 group-hover:text-brand transition-colors duration-200'>
                    {file.name}
              </p>
              <FormatedDateTime date={file.$createdAt!} className="body-2 text-light-200"/>
          </div>
      </Link>

      {isImage && (
        <ImageViewer 
          file={file} 
          isOpen={isViewerOpen} 
          onOpenChange={setIsViewerOpen} 
        />
      )}
    </>
  )
}

export default Card