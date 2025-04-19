'use client'
import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
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
                    <li className={cn('sidebar-nav-item',pathname===item.url && 'shad-active')}>
                      <Image src={item.icon} alt={item.name} width={24} height={24}/>
                      <p>{item.name}</p>
                    </li>
                  </Link>)
                })
              }
            </ul>

        </nav>
    </aside>
  )
}

export default Siderbar