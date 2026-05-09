"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/search", label: "Search Varieties" },
  { href: "/upload", label: "Task History" },
  { href: "/spaces", label: "My Spaces" },
];

export function TopAppBar() {
  const pathname = usePathname();

  return (
    <header className="bg-surface border-b border-outline-variant fixed top-0 z-50 w-full">
      <div className="flex justify-between items-center h-16 w-full px-4 md:px-[48px] max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/search"
            className="font-heading text-[24px] leading-[1.3] font-bold text-primary tracking-tight"
          >
            Floraputation
          </Link>
          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-all duration-200 px-2 py-1 rounded",
                  pathname.startsWith(link.href)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/upload"
            className="hidden md:block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-on-surface-variant hover:text-primary transition-colors px-3 py-1.5 rounded"
          >
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-all duration-200 text-on-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-all duration-200 text-on-surface-variant hidden md:flex">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden">
            <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
