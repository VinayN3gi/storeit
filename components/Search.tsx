import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/provider/AuthContext';
import { useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/action/file.action';
import Thumbnail from './Thumbnail';
import FormatedDateTime from './FormatedDateTime';
import { useRouter } from 'next/navigation';
import {useDebounce} from "use-debounce"

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

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const user = useAuth();
  const id = user.user?.id;
  const email = user.user?.email;
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [result,setResult]=useState<Document[]>([])
  const [open,setOpen]=useState(false)
  const router=useRouter()
  const [debounceQuery]=useDebounce(query,300)



  const handleClickTime=(doc:Document)=>{
    setOpen(false)
    setResult([])

    if(doc.type==="document")
    {
      router.push("/documents")
    }

    else if(doc.type==="image")
    {
      router.push("/images")
    }
    else if(doc.type==="video" || doc.type=="audio")
    {
      router.push("/media")
    }
    else
    {
      router.push("/others")
    }

  }

  useEffect(() => {
    const fetchFiles = async () => {
      if (!debounceQuery.trim()) {
      setOpen(false); // Hide results if input is empty
      setResult([]);
      return;
    }
      try {
        const files = await getFiles({
          userId: id,
          email: email,
          searchText: debounceQuery,
          sortText: '$createdAt-desc'
        });
        setResult(files.documents)
        setOpen(true)
      } catch (error) {
        console.log(error)
      }
    };

    fetchFiles()
    
  }, [id, email, debounceQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);




  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {
          open && (
            <ul className='search-result'>
              {
                result.length > 0 ? (
                  result.map((doc) => (
                    <li className='flex items-center justify-between'
                    key={doc.$id} onClick={()=>handleClickTime(doc)}>
                      <div className='flex cursor-pointer items-center gap-4'>
                        <Thumbnail
                        type={doc.type}
                        extension={doc.extension!}
                        url={doc.url}
                        className='size-9 min-w-9'
                        />
                        <p className='subtitle-2 line-clamp-1 text-light-100'>
                           {doc.name}
                        </p>
                      </div>
                      <FormatedDateTime date={doc.$createdAt!} className='caption line-clamp-1'/>
                      </li>
                  ))
                ) : (
                  <p className='empty-result'>
                    No files found
                  </p>
                )
              }
            </ul>
          )
        }
      </div>
    </div>
  );
};

export default Search;
