"use client";

import { AppShell } from "@/components/layout";
import { varieties } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

function ConfidenceDot({ level }: { level: "high" | "medium" | "low" }) {
  return (
    <div
      className={cn(
        "w-3 h-3 rounded-full border border-surface shadow-sm",
        level === "high" && "bg-confidence-high",
        level === "medium" && "bg-confidence-medium",
        level === "low" && "bg-confidence-low"
      )}
      title={`${level} confidence`}
    />
  );
}

export default function SearchPage() {
  return (
    <AppShell>
      <div className="p-4 md:p-[48px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="font-heading text-[48px] leading-[1.2] font-bold text-primary mb-2">
              Search Varieties
            </h1>
            <p className="font-body text-[16px] leading-[1.6] text-text-secondary">
              Browse and manage {varieties.length} varieties in the database.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-neutral border border-border-muted text-primary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">upload</span>
            Upload Catalogue
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface rounded-xl border border-border-muted p-4 mb-8 flex flex-wrap gap-4 items-center shadow-sm">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="material-symbols-outlined text-outline">
              search
            </span>
            <input
              className="w-full bg-transparent border-none focus:ring-0 font-body text-[14px] leading-[1.5] text-text-primary placeholder-outline p-0 focus:outline-none"
              placeholder="Search varieties, codes..."
              type="text"
            />
          </div>
          <div className="h-6 w-px bg-border-muted hidden md:block" />
          <div className="flex gap-2 flex-wrap">
            <select className="bg-surface-container-low border-none rounded-lg text-[13px] font-body text-text-primary py-2 pl-3 pr-8 focus:ring-1 focus:ring-primary">
              <option>Crop (All)</option>
              <option>Petunia</option>
              <option>Begonia</option>
              <option>Dahlia</option>
            </select>
            <select className="bg-surface-container-low border-none rounded-lg text-[13px] font-body text-text-primary py-2 pl-3 pr-8 focus:ring-1 focus:ring-primary">
              <option>Series (All)</option>
              <option>Wave</option>
              <option>Dragon Wing</option>
              <option>Mystic</option>
            </select>
            <button className="flex items-center gap-1 px-4 py-2 bg-surface-container-low rounded-lg text-[13px] font-body text-text-primary hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>
              More Filters
            </button>
          </div>
        </div>

        {/* Variety Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[20px]">
          {varieties.map((v) => (
            <div
              key={v.id}
              className={cn(
                "bg-surface rounded-xl border border-border-muted overflow-hidden hover:shadow-md transition-shadow duration-200 group flex flex-col",
                v.confidence === "low" && "ring-1 ring-confidence-low/30"
              )}
            >
              <div className="relative w-full aspect-square bg-surface-container-low">
                {v.score > 40 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={`${v.crop} ${v.variety}`}
                    className="w-full h-full object-cover"
                    src={v.imageUrl}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-4xl">
                      local_florist
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <ConfidenceDot level={v.confidence} />
                </div>
                {v.inSpace && (
                  <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded font-body text-[11px] leading-[1.2] text-primary border border-border-muted">
                    In My Space
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-primary uppercase">
                    {v.crop} - {v.series}
                  </span>
                  <span
                    className={cn(
                      "font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold",
                      v.confidence === "high" && "text-confidence-high",
                      v.confidence === "medium" && "text-confidence-medium",
                      v.confidence === "low" && "text-confidence-low"
                    )}
                  >
                    {v.score}
                  </span>
                </div>
                <h3 className="font-body text-[14px] leading-[1.5] text-text-primary truncate">
                  {v.variety}
                </h3>
                <span className="font-body text-[11px] leading-[1.2] text-text-secondary">
                  #{v.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
