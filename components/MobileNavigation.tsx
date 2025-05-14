'use client';
import React, { useState } from 'react';
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

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router=useRouter();

  const logOut=()=>{
    router.replace("/sign-in")
  }
  return (
    <header
      className="mobile-header"
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="open"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="mt-5" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                const active = pathname === item.url;
                return (
                  <Link key={item.name} href={item.url} className="lg:w-full">
                    <li
                      className={cn(
                        'sidebar-nav-item',
                        pathname === item.url && 'shad-active'
                      )}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className={cn(
                          'nav-icon',
                          pathname === item.url && 'nav-icon-active'
                        )}
                      />
                      <p className="hidden lg:block">{item.name}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
            <div className="h-0.5 bg-gray-200/30 w-full" />
            <div className="flex flex-col justify-between gap-5 items-center mt-5">
              FileUploader
              <Button type="submit" className="mobile-sign-out-button" onClick={logOut}>
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;