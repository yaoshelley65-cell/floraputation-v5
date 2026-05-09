"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { spaces } from "@/lib/placeholder-data";

export function SideNavBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex bg-surface-container/90 backdrop-blur-md border-r border-outline-variant fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 flex-col py-6 space-y-2 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="px-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
          <div>
            <h2 className="font-heading text-[20px] leading-[1.4] font-semibold text-primary">
              Spaces
            </h2>
            <p className="font-body text-[13px] leading-[1.4] text-on-surface-variant">
              Management
            </p>
          </div>
        </div>
        <Link
          href="/spaces"
          className="w-full bg-surface hover:bg-surface-container-high border border-outline-variant text-primary py-2.5 px-4 rounded-md font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-colors flex justify-center items-center"
        >
          <span className="material-symbols-outlined mr-2 text-[18px]">
            add
          </span>
          New Space
        </Link>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {spaces.map((space) => {
          const isActive = pathname === `/spaces/${space.id}`;
          return (
            <Link
              key={space.id}
              href={`/spaces/${space.id}`}
              className={cn(
                "flex items-center px-4 py-3 mx-2 rounded-full transition-all duration-300 ease-in-out",
                isActive
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              )}
            >
              <span
                className="material-symbols-outlined mr-3 text-[20px]"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {space.icon}
              </span>
              <span className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold">
                {space.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto px-6 space-y-2 pt-4 border-t border-border-muted mx-4">
        <a
          href="#"
          className="flex items-center px-2 py-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined mr-3 text-[18px]">
            help
          </span>
          <span className="font-body text-[13px] leading-[1.4]">Help</span>
        </a>
        <Link
          href="/login"
          className="flex items-center px-2 py-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined mr-3 text-[18px]">
            logout
          </span>
          <span className="font-body text-[13px] leading-[1.4]">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
