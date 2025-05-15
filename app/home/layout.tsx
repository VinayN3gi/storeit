import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Siderbar from '@/components/Siderbar';
import { getCurrentUser } from '@/lib/action/user.action';
import { redirect } from 'next/navigation';
import React from 'react';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex h-screen">
            <Siderbar/>
            <section className="flex h-full flex-1 flex-col">
                <div className='block sm:hidden'>
                    <MobileNavigation/>
                </div>
                
                <Header/>
                <div className="main-content">{children}</div>
            </section>
        </main>
    );
};

export default Layout;
