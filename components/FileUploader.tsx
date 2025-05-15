'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'

interface FileUploaderProps {
  ownerId: string
  accountId: string
  className?: string
}

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback(async (acceptedFiles:File[]) => {
    setFiles(acceptedFiles)
  
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <Button type="button" className={cn('uploader-button', className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="Upload"
          width={20}
          height={20}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading..</h4>
          {
            files.map((file,index)=>{
              const {type,extension}=getFileType(file.name);

              return (
                <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                    <div className='flex items-center gap-3'>
                        <Thumbnail 
                        type={type}
                        extension={extension}
                        url={convertFileToUrl(file)}
                        />
                    </div>
                </li>
              )
            })
          }
        </ul>
      )}
      <input {...getInputProps()} />
    </div>
  )
}

export default FileUploader
