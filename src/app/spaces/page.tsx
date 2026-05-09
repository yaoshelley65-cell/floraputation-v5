"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout";

export default function SpacesPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 pb-24 md:pb-8 relative">
        {/* Minimalist Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="max-w-lg w-full text-center flex flex-col items-center z-10">
          {/* Illustration Frame */}
          <div className="w-48 h-48 mb-8 rounded-full bg-surface border border-border-muted shadow-sm flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
            <span
              className="material-symbols-outlined text-7xl text-primary/60 relative z-10"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
            >
              eco
            </span>
          </div>

          {/* Text Content */}
          <h1 className="font-heading text-[24px] leading-[1.3] font-semibold text-on-surface mb-3 tracking-tight">
            No varieties found.
          </h1>
          <p className="font-body text-[16px] leading-[1.6] text-on-surface-variant mb-10 max-w-md mx-auto">
            Start by uploading a catalogue or adjusting your filters.
          </p>

          {/* Primary CTA */}
          <Link
            href="/upload"
            className="bg-primary hover:bg-surface-tint text-on-primary px-8 py-3.5 rounded-lg font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-all duration-200 shadow-sm hover:shadow active:scale-95 flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              upload
            </span>
            <span>Upload Catalogue</span>
          </Link>
          <Link
            href="/search"
            className="border border-outline text-primary hover:bg-surface-container-low px-8 py-3.5 rounded-lg font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-all duration-200 active:scale-95 flex items-center space-x-2 mt-4"
          >
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
            <span>Search Varieties</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
