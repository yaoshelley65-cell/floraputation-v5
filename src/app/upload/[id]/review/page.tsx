"use client";

import { AppShell } from "@/components/layout";
import { varieties } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

export default function ReviewPage() {
  return (
    <AppShell showSidebar={false}>
      <div className="p-4 md:p-[48px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="font-heading text-[24px] leading-[1.3] font-semibold text-on-surface mb-1">
              Human Validation
            </h1>
            <p className="font-body text-[14px] leading-[1.5] text-text-secondary">
              Review AI-extracted varieties. Low confidence items are highlighted.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border border-outline-variant text-text-secondary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Export ZIP
            </button>
            <button className="px-6 py-2 rounded-lg bg-primary text-on-primary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              Confirm All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-xl border border-border-muted overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[48px_56px_2fr_1.5fr_1fr_1.5fr_1fr] items-center px-4 py-3 border-b border-border-muted bg-surface-container-low">
            <div className="flex items-center justify-center">
              <input
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                type="checkbox"
              />
            </div>
            <div className="font-body text-[11px] leading-[1.2] text-text-secondary">
              IMG
            </div>
            <div className="font-body text-[11px] leading-[1.2] text-text-secondary font-medium">
              VARIETY NAME
            </div>
            <div className="font-body text-[11px] leading-[1.2] text-text-secondary font-medium">
              CONFIDENCE
            </div>
            <div className="font-body text-[11px] leading-[1.2] text-text-secondary font-medium">
              SCORE
            </div>
            <div className="font-body text-[11px] leading-[1.2] text-text-secondary font-medium">
              SOURCE
            </div>
            <div className="font-body text-[11px] leading-[1.2] text-text-secondary font-medium text-right">
              ACTIONS
            </div>
          </div>

          {/* Table Rows */}
          {varieties.slice(0, 5).map((v, idx) => (
            <div
              key={v.id}
              className={cn(
                "grid grid-cols-[48px_56px_2fr_1.5fr_1fr_1.5fr_1fr] items-center px-4 py-2 border-b border-border-muted hover:bg-surface-container-lowest transition-colors group",
                idx < 2 && "bg-primary-fixed/10 hover:bg-primary-fixed/20",
                v.confidence === "low" &&
                  "shadow-[inset_4px_0_0_0_#E6A2A2]"
              )}
            >
              <div className="flex items-center justify-center">
                <input
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                  type="checkbox"
                  defaultChecked={idx < 2}
                />
              </div>
              <div>
                <div className="w-10 h-10 rounded border border-border-muted overflow-hidden bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={v.variety}
                    className="w-full h-full object-cover"
                    src={v.imageUrl}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-body text-[13px] leading-[1.4] font-medium text-text-primary">
                  {v.crop} &apos;{v.variety}&apos;
                </span>
                <span
                  className={cn(
                    "font-body text-[11px] leading-[1.2] text-text-secondary",
                    v.confidence === "low" && "text-error"
                  )}
                >
                  {v.confidence === "low"
                    ? "Unverifiable Taxon"
                    : `ID: ${v.id}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    v.confidence === "high" && "bg-confidence-high",
                    v.confidence === "medium" && "bg-confidence-medium",
                    v.confidence === "low" && "bg-confidence-low"
                  )}
                />
                <span className="font-body text-[13px] leading-[1.4] text-text-secondary">
                  {v.confidence === "high" && "High Confidence"}
                  {v.confidence === "medium" && "Needs Review"}
                  {v.confidence === "low" && "Low Confidence"}
                </span>
              </div>
              <div>
                <span
                  className={cn(
                    "px-2 py-1 rounded font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold",
                    v.confidence === "low"
                      ? "bg-error-container text-on-error-container"
                      : "bg-surface-container text-text-primary"
                  )}
                >
                  {v.score}
                </span>
              </div>
              <div className="font-body text-[13px] leading-[1.4] text-text-secondary truncate pr-4">
                {v.source}
              </div>
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded flex items-center justify-center text-text-secondary hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Batch Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-container/95 backdrop-blur-md border-t border-border-muted p-4 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold">
            2
          </div>
          <span className="font-body text-[14px] leading-[1.5] text-text-primary font-medium">
            Items selected
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant text-text-secondary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
            <span className="hidden sm:inline">Delete Selected</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-secondary-container text-on-secondary-container font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-secondary-fixed transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              edit_note
            </span>
            <span className="hidden sm:inline">Batch Edit</span>
          </button>
          <button className="px-6 py-2 rounded-lg bg-primary text-on-primary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
            Batch Confirm
          </button>
        </div>
      </div>
    </AppShell>
  );
}
