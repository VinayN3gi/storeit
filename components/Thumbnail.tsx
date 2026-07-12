import { cn, getFileIcon } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface ThumbnailProp{
    type:string,
    extension:string,
    url?:string,
    imageClassName?:string,
    className?:string
}

const Thumbnail = ({type,extension,url="",imageClassName,className}:ThumbnailProp) => {
  
  const isImage = type === "image" && extension !== "svg" && url;
  
  return (
    <figure className={cn("thumbnail flex items-center justify-center overflow-hidden bg-slate-50 border border-slate-100", className)}>
        <Image 
          src={isImage ? url : getFileIcon(extension, type)} 
          width={100}
          height={100}
          className={cn("size-8 object-contain", imageClassName, isImage && "thumbnail-image size-full object-cover")}
          alt="thumbnail"
        />
    </figure>
  )
}

export default Thumbnail