'use client';

import Card from '@/components/Card';
import SortComponent from '@/components/SortComponent';
import { getFiles } from '@/lib/action/file.action';
import { useAuth } from '@/provider/AuthContext';
import { useFileContext } from '@/provider/FileContext';
import { motion } from 'framer-motion';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

const DocumentPageContent = () => {
  const user = useAuth();
  const email = user.user?.email;
  const id = user.user?.id;

  const [files, setFiles] = useState<Document[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { refreshFlag } = useFileContext();

  // ✅ Proper way to get query params in client
  const searchParams = useSearchParams();
  const search = searchParams.get('query') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);

      if (id && email) {
        const result = await getFiles({
          userId: id,
          email,
          type1: 'document',
          searchText: search,
          sortText: sort,
        });

        setFiles(result.documents);
      }

      setLoading(false);
    };

    fetchFiles();
  }, [id, email, refreshFlag, search, sort]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-10">
        <motion.div
          className="w-11 h-11 border-4 border-t-transparent border-green rounded-full"
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
            <p className="body-1 hidden sm:block text-light-200">
              Sort by:
            </p>

            {/* ✅ FIX: Wrap in Suspense */}
            <Suspense fallback={<div>Loading...</div>}>
              <SortComponent />
            </Suspense>
          </div>
        </div>
      </section>

      {files.length > 0 ? (
        <section className="file-list">
          {files.map((file) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

function Documentpage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentPageContent />
    </Suspense>
  );
}

export default Documentpage;