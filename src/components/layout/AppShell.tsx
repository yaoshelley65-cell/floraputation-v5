"use client";

import { TopAppBar } from "./TopAppBar";
import { SideNavBar } from "./SideNavBar";
import { BottomNavBar } from "./BottomNavBar";

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppShell({ children, showSidebar = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background-main">
      <TopAppBar />
      {showSidebar && <SideNavBar />}
      <main
        className={`pt-16 pb-20 md:pb-0 ${
          showSidebar ? "md:ml-64" : ""
        } min-h-screen`}
      >
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
