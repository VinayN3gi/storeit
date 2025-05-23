import Link from 'next/link';
import React from 'react'
import Thumbnail from './Thumbnail';
import { convertFileSize } from '@/lib/utils';
import FormatedDateTime from './FormatedDateTime';

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
  return (
    <Link href={file.url} target='_blank' className='file-card'>
        <div className='flex justify-between'>
            <Thumbnail type={file.type} extension={file.url} 
            className='!size-20'
            imageClassName='!size-11'
            />
            <div className='flex flex-col items-end justify-between'>
                ActionsDropdown
               <p className='body-1'>
                {
                    convertFileSize(file.size!)
                }
            </p> 
            </div>
        </div>
        <div className='file-card-details'>
            <p className='subtitle-2 line-clamp-1'>
                  {file.name}
            </p>
            <FormatedDateTime date={file.$createdAt!} className="body-2 text-light-100"/>
        </div>
      
    </Link>
  )
}

export default Card