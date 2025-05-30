'use client'
import ActionDropdown from '@/components/ActionDropdown'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import { Models } from "node-appwrite"
import FormatedDateTime from '@/components/FormatedDateTime'
import Thumbnail from '@/components/Thumbnail'
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { useAuth } from '@/provider/AuthContext'
import { motion } from 'framer-motion';
import { getFiles } from '@/lib/action/file.action'

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

const HomePage = () => {
   const user = useAuth();
   const email = user.user?.email;
   const id = user.user?.id;
   const [files,setFiles]=useState<Document[]>([])
   const [isLoading,setLoading]=useState(false)

  useEffect(()=>{
    const fetchFiles=async()=>{
      setLoading(true)
      try {
        if(email && id)
        {
          const result=await getFiles({userId:id,email:email,searchText: "", sortText: "$createdAt-desc",limit:10})
        setFiles(result.documents)
        console.log(result.documents)
        }
      
      } catch (error) {
        
      }
      setLoading(false)
    }
    fetchFiles()
  },[email,id])


  if (isLoading) {
      return (
        <div className="flex items-center justify-center h-10">
          <motion.div
            className="w-11 h-11 border-4 border-t-transparent border-red rounded-full animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
          />
        </div>
      );
    }


  return (
    <div>
      Home
    </div>
  )
}

export default HomePage