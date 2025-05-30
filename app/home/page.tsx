'use client';
import ActionDropdown from '@/components/ActionDropdown';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Models } from 'node-appwrite';
import FormatedDateTime from '@/components/FormatedDateTime';
import Thumbnail from '@/components/Thumbnail';
import { convertFileSize, getUsageSummary } from '@/lib/utils';
import { useAuth } from '@/provider/AuthContext';
import { motion } from 'framer-motion';
import { getFiles, getTotalSpaceUsed } from '@/lib/action/file.action';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Chart } from '@/components/Chart';

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
  const [files, setFiles] = useState<Document[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [totalSpace, setSpace] = useState<any>();

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        if (email && id) {
          const result = await getFiles({
            userId: id,
            email: email,
            searchText: '',
            sortText: '$createdAt-desc',
            limit: 10,
          });
          setFiles(result.documents);
          const spaceUsed = await getTotalSpaceUsed({ userId: id, email: email });
          console.log(spaceUsed);
          setSpace(spaceUsed);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchFiles();
  }, [email, id]);

  

  if (isLoading || !totalSpace) {
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

  console.log(totalSpace)
  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace?.used} />
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormatedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>



      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.map((file: Document) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension!}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormatedDateTime
                      date={file.$createdAt!}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
