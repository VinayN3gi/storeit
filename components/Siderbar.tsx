"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/AuthContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const email = user?.email || "user@storeit.com";
  const name = email.split("@")[0];
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="flex flex-col gap-8">
        <Link href="/">
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={160}
            height={50}
            className="hidden h-auto lg:block"
          />

          <Image
            src="/assets/icons/logo-brand.svg"
            alt="logo"
            width={52}
            height={52}
            className="lg:hidden"
          />
        </Link>

        <nav className="sidebar-nav">
          <ul className="flex flex-1 flex-col gap-2">
            {navItems.map(({ url, name, icon }) => (
              <Link key={name} href={url} className="lg:w-full">
                <li
                  className={cn(
                    "sidebar-nav-item",
                    pathname === url && "shad-active",
                  )}
                >
                  <Image
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                    className={cn(
                      "nav-icon transition-all duration-200",
                      pathname === url && "nav-icon-active",
                    )}
                  />
                  <p className="hidden lg:block">{name}</p>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <Image
          src="/assets/images/files-2.png"
          alt="logo"
          width={506}
          height={418}
          className="w-full transition-all duration-300 hover:scale-[1.03]"
        />

        {/* User Profile Block - Glassmorphic */}
        <div className="sidebar-user-info">
          <div className="flex-center size-10 min-w-10 rounded-full bg-brand/15 border border-brand/20 text-brand font-bold text-sm shadow-sm select-none">
            {initials}
          </div>
          <div className="hidden lg:flex flex-col truncate">
            <p className="subtitle-2 capitalize truncate">{name}</p>
            <p className="caption text-light-200 truncate">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;