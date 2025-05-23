import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Siderbar from '@/components/Siderbar';
import React from 'react';
import { Toaster } from "@/components/ui/sonner"
import { FileProvider } from '@/provider/FileContext';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <FileProvider>
        <main className="flex h-screen">
            <Siderbar/>
            <section className="flex h-full flex-1 flex-col">
                <div className='block sm:hidden'>
                    <MobileNavigation/>
                </div>
                <Header/>
                <div className="main-content">{children}</div>
            </section>
            <Toaster/>
        </main>
        </FileProvider>
    );
};

export default Layout;
