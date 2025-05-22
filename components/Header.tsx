'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import Search from './Search';
import FileUploader from './FileUploader';
import { getCurrentUser, logout } from '@/lib/action/user.action';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/provider/AuthContext';
import { appwriteConfig } from '@/lib/appwrite/config';

const Header = () => {
  const user=useAuth()
  const userId=user.user?.id
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const logOut = async () => {
    setLoading(true);
    try {
      const session = await logout();
      if (session.success) {
        router.replace('/sign-in');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader 
          ownerId={userId!}
          accountId={userId!}
        />
        <form>
          <Button type="submit" className="sign-out-button" onClick={()=>logOut()}>
            {!isLoading && (
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
                className="w-6"
              />
            )}
            {isLoading && (
              <motion.div
                className="w-6 h-6 border-4 border-t-transparent border-red rounded-full animate-spin"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
              />
            )}
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;