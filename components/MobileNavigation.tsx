'use client';
import React, {useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { navItems } from '@/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import FileUploader from './FileUploader';
import { useAuth } from '@/provider/AuthContext';
import { logout } from '@/lib/action/user.action';

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router=useRouter();
  const [isLoading,setLoading]=useState(false);
  const { user, setUser } = useAuth();
  const userId=user?.id

  const logOut=async ()=>{
    setLoading(true)
    try {
      await logout();
      setUser(null);
      window.location.replace("/sign-in");
      setOpen(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <header className="mobile-header">
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/images/logo.png"
          alt="logo"
          width={120}
          height={38}
          className="h-auto object-contain"
        />
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="outline-none">
          <Image
            src="/assets/icons/menu.svg"
            alt="open"
            width={30}
            height={30}
            className="hover:scale-105 active:scale-95 transition-transform"
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-5 glass-card">
          <SheetTitle>
            <div className="mt-5" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                return (
                  <Link key={item.name} href={item.url} className="lg:w-full" onClick={() => setOpen(false)}>
                    <li
                      className={cn(
                        'mobile-nav-item',
                        pathname === item.url && 'shad-active'
                      )}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className={cn(
                          'nav-icon transition-all duration-200',
                          pathname === item.url && 'nav-icon-active'
                        )}
                      />
                      <p>{item.name}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
            
            <div className="flex flex-col gap-5 items-stretch mt-auto">
              <div className="h-0.5 bg-gray-200/30 w-full" />
              
              {/* User info - brand themed */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand/5 border border-brand/10">
                <div className="flex-center size-9 min-w-9 rounded-full bg-brand/15 border border-brand/20 text-brand font-bold text-xs select-none">
                  {user?.email?.slice(0, 2).toUpperCase() || "US"}
                </div>
                <div className="flex flex-col truncate">
                  <p className="caption text-light-200 truncate">{user?.email || "guest@storeit.com"}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-5 items-center">
                <FileUploader ownerId={userId!} accountId={userId!}/>
                <Button type="submit" className="mobile-sign-out-button" onClick={logOut}>
                  {!isLoading && (
                    <Image
                      src="/assets/icons/logout.svg"
                      alt="logout"
                      width={24}
                      height={24}
                    />
                  )}
                  {isLoading && (
                    <motion.div
                      className="w-6 h-6 border-3 border-t-transparent border-brand rounded-full animate-spin"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                    />
                  )}
                </Button>
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;