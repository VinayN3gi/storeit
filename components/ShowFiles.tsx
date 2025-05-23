import { getFiles } from '@/lib/action/file.action'
import React from 'react'

interface getFilesProps{
    userId:string | undefined,
    email:string | undefined
}

const ShowFiles = async ({userId,email}:getFilesProps) => {
  const files=await getFiles({userId,email})
  console.log(files)  

  return (
    <div>ShowFiles</div>
  )
}

export default ShowFiles