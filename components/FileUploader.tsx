'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { motion } from 'framer-motion'
import { MAX_FILE_SIZE } from '@/constants'
import { toast } from 'sonner'
import { uploadFile } from '@/lib/action/file.action'
import { usePathname } from 'next/navigation'
import { useFileContext } from '@/provider/FileContext'

interface FileUploaderProps {
  ownerId: string
  accountId: string
  className?: string
}

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const path=usePathname();
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setLoading] = useState(true)
  const {triggerRefresh}=useFileContext()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
   const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
        setLoading(false)
        return toast('Error Uploading file', {
          description: (
            <p className="body-2 text-black">
              <span className="font-semibold truncate">{file.name}</span> is too large. Max file size is 50MB.
            </p>
          ),
          duration: 2000,
        });
      }

      return uploadFile({
        file,
        ownerId,
        accountId,
        path,
      }).then((uploadedFile) => {
        if (uploadedFile) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
        }
      });
    });

    await Promise.all(uploadPromises)
    triggerRefresh()
    setLoading(false)
  }, [ownerId,accountId,path])

  const { getRootProps, getInputProps} = useDropzone({ onDrop })

  const handleRemoveFile = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation()
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <Button type="button" className={cn('uploader-button', className)}>
        <Image src="/assets/icons/upload.svg" alt="Upload" width={20} height={20} />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading..</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name)
            return (
              <li key={`${file.name}-${index}`} className="uploader-preview-item">
                <div
                  className="flex items-center gap-3"
                  style={{ width: '70%', maxHeight: '56px', overflow: 'hidden' }}
                >
                  <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />
                  <div
                    className="preview-item-name truncate"
                    style={{ maxHeight: '56px', lineHeight: '28px' }}
                  >
                    {file.name}
                  </div>
                </div>
                {isLoading && (
                  <motion.div
                    className="w-7 h-7 border-4 border-t-transparent border-gray rounded-full animate-spin"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                  />
                )}
                <Image
                  src="/assets/icons/remove.svg"
                  alt="Remove"
                  height={24}
                  width={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            )
          })}
        </ul>
      )}
      <input {...getInputProps()} />
    </div>
  )
}

export default FileUploader
