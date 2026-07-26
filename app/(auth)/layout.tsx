import Image from 'next/image'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            {/* Left Brand Panel */}
            <section className="bg-brand p-10 hidden w-1/2 items-center justify-between lg:flex xl:w-2/5 relative overflow-hidden">
                {/* Floating decorative circles */}
                <div className="absolute top-[10%] right-[15%] w-[180px] h-[180px] rounded-full bg-white/10 blur-[2px] pointer-events-none" />
                <div className="absolute bottom-[15%] left-[10%] w-[120px] h-[120px] rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute top-[60%] right-[40%] w-[80px] h-[80px] rounded-full bg-brand-100/30 pointer-events-none" />
                
                <div className="relative z-10 flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
                    <Image
                        src="/assets/images/logo.svg"
                        alt="logo"
                        width={124}
                        height={120}
                        className="h-auto"
                    />
                    {/* Glassmorphic text card */}
                    <div className="glass-panel rounded-2xl p-6 space-y-5 text-white">
                        <h1 className="h1 text-white">Manage all your files in one place</h1>
                        <p className="body-1 text-white/80">
                            Effortlessly organize, share, and access your files anytime, anywhere—securely and seamlessly.
                        </p>
                    </div>
                </div>
                <Image
                    src="/assets/images/files.png"
                    alt="Files"
                    width={342}
                    height={342}
                    className="relative z-10 transition-all duration-300 hover:rotate-2 hover:scale-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                />
            </section>

            {/* Right Form Panel */}
            <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0 bg-gradient-to-b from-brand/[0.02] to-white'>
                <div className='mb-16 lg:hidden'>
                    <Image src="/assets/images/logo.svg"
                    alt="logo"
                    width={224}
                    height={100}
                    className='h-auto w-[200px] lg:w-[250px]'
                    />    
                </div>
                 {children}
            </section>
        </div>
    );
};

export default Layout