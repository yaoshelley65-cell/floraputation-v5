"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout";
import { processingSteps } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

export default function ProcessingPage() {
  const totalPages = 48;
  const processedPages = 23;
  const progressPercent = Math.round((processedPages / totalPages) * 100);
  const estimatedTimeRemaining = "~3 min";

  return (
    <AppShell showSidebar={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 md:p-[48px]">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-primary-fixed/30 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
                hourglass_top
              </span>
            </div>
            <h1 className="font-heading text-[24px] leading-[1.3] font-semibold text-on-surface mb-2">
              Processing Your Catalogue
            </h1>
            <p className="font-body text-[16px] leading-[1.6] text-text-secondary">
              Evanthia_Spring_2026.pdf
            </p>
          </div>

          {/* Progress Overview Card */}
          <div className="bg-surface rounded-xl border border-border-muted p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary uppercase">
                  Page Progress
                </p>
                <p className="font-heading text-[20px] leading-[1.4] font-semibold text-on-surface mt-1">
                  {processedPages} / {totalPages} pages
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary uppercase">
                  Est. Remaining
                </p>
                <p className="font-heading text-[20px] leading-[1.4] font-semibold text-primary mt-1">
                  {estimatedTimeRemaining}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
              </div>
            </div>
            <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-2 text-right">
              {progressPercent}% complete
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="bg-surface rounded-xl border border-border-muted p-6 shadow-sm mb-6">
            <h3 className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary uppercase mb-4">
              Extraction Pipeline
            </h3>
            <div className="space-y-3">
              {processingSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                      step.status === "complete" &&
                        "bg-confidence-high text-white",
                      step.status === "active" &&
                        "bg-primary text-on-primary animate-pulse",
                      step.status === "pending" &&
                        "bg-surface-container border border-border-muted text-text-secondary"
                    )}
                  >
                    {step.status === "complete" && (
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                    )}
                    {step.status === "active" && (
                      <span className="material-symbols-outlined text-[14px]">
                        sync
                      </span>
                    )}
                    {step.status === "pending" && (
                      <span className="font-body text-[10px] font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "font-body text-[14px] leading-[1.5]",
                      step.status === "complete" && "text-text-secondary",
                      step.status === "active" &&
                        "text-text-primary font-medium",
                      step.status === "pending" && "text-text-secondary/60"
                    )}
                  >
                    {step.name}
                  </span>
                  {step.status === "active" && (
                    <span className="ml-auto font-body text-[11px] leading-[1.2] text-primary bg-primary-fixed/30 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                  {step.status === "complete" && (
                    <span className="ml-auto font-body text-[11px] leading-[1.2] text-confidence-high">
                      Done
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-surface rounded-xl border border-border-muted p-4 text-center">
              <p className="font-heading text-[20px] leading-[1.4] font-semibold text-primary">
                47
              </p>
              <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                Images Found
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border-muted p-4 text-center">
              <p className="font-heading text-[20px] leading-[1.4] font-semibold text-confidence-high">
                38
              </p>
              <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                Auto-Named
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border-muted p-4 text-center">
              <p className="font-heading text-[20px] leading-[1.4] font-semibold text-confidence-low">
                3
              </p>
              <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                Need Review
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="text-center">
            <Link
              href="/upload/demo-123/review"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border-muted rounded-lg font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-primary hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                visibility
              </span>
              Preview Results (while processing)
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
