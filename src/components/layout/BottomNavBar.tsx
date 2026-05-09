"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/search", icon: "search", label: "Search" },
  { href: "/upload", icon: "history", label: "Tasks" },
  { href: "/spaces", icon: "grid_view", label: "Spaces" },
  { href: "/login", icon: "person", label: "Profile" },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden bg-surface/95 backdrop-blur-sm border-t border-outline-variant fixed bottom-0 w-full z-50 flex justify-around items-center h-16 px-4 shadow-sm">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-1/4 p-2 rounded-lg transition-transform active:scale-95",
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span className="font-body text-[11px] leading-[1.2]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
