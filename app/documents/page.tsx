'use client';
import ShowFiles from '@/components/ShowFiles';
import SortComponent from '@/components/SortComponent';
import { getFiles } from '@/lib/action/file.action';
import { useAuth } from '@/provider/AuthContext';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

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

const Documentpage = () => {
  const user = useAuth();
  const email = user.user?.email;
  const id = user.user?.id;
  console.log(`From the document page  ${id} and ${email}`)
  const [files, setFiles] = useState<Document[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      if (id && email) {
        const result = await getFiles({ userId: id, email });
        console.log(result.documents);
        setFiles(result.documents);
      }
      setLoading(false);
    };

    fetchFiles();
  }, [id,email]);

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
    <div className="page-container">
      <section className="w-full">
        <h1 className="h2 capitalize">Documents</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total:<span className="h5">0 MB</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <SortComponent />
          </div>
        </div>
      </section>
      {files.length > 0 ? (
        <section className='file-list'>
         {
          files.map((file)=>(
            <h1 className='h1' key={file.$id}>
              {file.name}
            </h1>
          ))
         }
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Documentpage;
