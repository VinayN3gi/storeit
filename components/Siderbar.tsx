'use client'
import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import { useAuth } from '@/provider/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Siderbar = () => {
  
  const pathname=usePathname();
  return (
    <aside className='sidebar'>
        <Link href="/home">
        <Image
            src="/favicon.ico"
            alt='logo'
            width={160}
            height={50}
            className='hidden h-auto lg:block'
        />
        <Image
            src="/favicon.ico"
            alt='logo'
            width={52}
            height={52}
            className='lg:hidden'
        />
        </Link>
        <nav className='sidebar-nav'>
            <ul className='flex flex-1 flex-col gap-6'>
              {
                navItems.map((item)=>{
                  const active=pathname===item.url;
                  return (
                  <Link key={item.name} href={item.url} className='lg:w-full '>
                    <li className={cn('sidebar-nav-item',(pathname===item.url && 'shad-active'))}>
                      <Image src={item.icon} alt={item.name} width={24} height={24}
                      className={cn('nav-icon',(pathname===item.url && 'nav-icon-active'))}
                      />
                      <p className='hidden lg:block'>{item.name}</p>
                    </li>
                  </Link>)
                })
              }
            </ul>
        </nav>

        <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className='w-full'
        />
        
        {/*<div className='sidebar-user-info'>
            <div className='hidden lg:block'>
              <p className='subtitle-2 capitalize'>Welcome back,</p>
              <p className='caption'>{user?.email}</p>
            </div>
        </div>*/}
    </aside>
  )
}

export default Siderbar