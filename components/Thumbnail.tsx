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
  
  const isImage=type==="image" && extension!="svg" && url
  return (
    <figure>
        <Image src={getFileIcon(extension,type)} 
        width={100}
        height={100}
        className={cn("size-8 object-contain",imageClassName,isImage && "thumbnail-image")}
        alt="thumbnail"/>
    </figure>
  )
}

export default Thumbnail