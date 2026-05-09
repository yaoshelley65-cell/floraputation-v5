"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

function ConfidenceIndicator({ level }: { level: "high" | "medium" | "low" }) {
  return (
    <span
      className={cn(
        "w-2.5 h-2.5 rounded-full",
        level === "high" && "bg-confidence-high",
        level === "medium" && "bg-confidence-medium",
        level === "low" && "bg-confidence-low"
      )}
      title={`${level} confidence`}
    />
  );
}

export default function EditVarietyPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-hidden">
      {/* Background blur overlay */}
      <div className="fixed inset-0 z-0 blur-sm opacity-60 pointer-events-none select-none bg-surface-container" />

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-[48px] bg-surface-container/80 backdrop-blur-md">
        {/* Modal Container */}
        <div className="bg-surface rounded-xl shadow-lg border border-border-muted w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative">
          {/* Close Button */}
          <Link
            href="/search"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface/50 hover:bg-surface-container transition-colors text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </Link>

          {/* Left Pane: Image Preview */}
          <div className="w-full md:w-1/2 bg-surface-container-lowest relative aspect-square md:aspect-auto min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              alt="Variety preview"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDii8r0parB6YoBMuAkJpR3H7OrgvaRIIb8hErTbSPVsHs1e1K20D9_96RDLXdYcBoz773mp6MasQ8mDJwRIc5mKfvxH80VxfCKLOWX5kB6N1m9PZsvvINW8KbOF8QvguCVjtC4IPI4lIdrdnod_h4pRiKFM3fTQc5dRHQP7tCrWQUfbFhI1UfT78F5f5yHwa4he97IRFrbgsVVABYOytHaZEvA9gXaXtFVGoTsAWvoKAZI9Le4fzMXRhkr2LPi2J9YjD_Im3IB-GU"
            />
            {/* Quality Scorer Badge */}
            <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-on-surface shadow-sm flex items-center gap-1.5 border border-border-muted">
              <span className="material-symbols-outlined text-[16px] text-primary">
                verified
              </span>
              Score: 92
            </div>
          </div>

          {/* Right Pane: Form Fields */}
          <div className="w-full md:w-1/2 flex flex-col bg-surface p-6 md:p-8 overflow-y-auto">
            <div className="mb-8">
              <h2 className="font-heading text-[24px] leading-[1.3] font-semibold text-on-surface mb-2">
                Variety Metadata
              </h2>
              <p className="font-body text-[13px] leading-[1.4] text-text-secondary">
                Review and correct AI-extracted properties.
              </p>
            </div>

            <div className="space-y-6 flex-1">
              {/* Field: Crop (High Confidence) */}
              <div className="relative group">
                <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5 flex justify-between items-center">
                  Crop Group
                  <ConfidenceIndicator level="high" />
                </label>
                <input
                  className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  type="text"
                  defaultValue="Petunia"
                />
              </div>

              {/* Field: Series (Medium Confidence) */}
              <div className="relative group">
                <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5 flex justify-between items-center">
                  Series
                  <ConfidenceIndicator level="medium" />
                </label>
                <input
                  className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  type="text"
                  defaultValue="Wave®"
                />
              </div>

              {/* Field: Variety Name (Low Confidence - Anomaly Highlight) */}
              <div className="relative group">
                <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5 flex justify-between items-center">
                  Variety Name
                  <ConfidenceIndicator level="low" />
                </label>
                <div className="relative rounded-md overflow-hidden shadow-[inset_0_0_8px_rgba(230,162,162,0.4)] ring-1 ring-confidence-low border-none">
                  <input
                    className="w-full bg-surface-neutral/50 border-none px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:bg-surface-neutral transition-colors"
                    type="text"
                    defaultValue="Pink Morn"
                  />
                </div>
                <p className="mt-1.5 font-body text-[11px] leading-[1.2] text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    warning
                  </span>
                  Check for typos in variety name.
                </p>
              </div>

              {/* Field: Internal Code */}
              <div className="relative group">
                <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5 flex justify-between items-center">
                  Breeder Code
                  <ConfidenceIndicator level="high" />
                </label>
                <input
                  className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-text-secondary font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  type="text"
                  defaultValue="PET-WM-042"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-border-muted flex items-center justify-end gap-3">
              <Link
                href="/search"
                className="px-5 py-2.5 rounded-md font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary hover:bg-surface-container transition-colors"
              >
                Discard
              </Link>
              <button className="px-6 py-2.5 rounded-md font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold bg-primary text-on-primary hover:bg-surface-tint transition-colors shadow-sm">
                Approve &amp; Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
