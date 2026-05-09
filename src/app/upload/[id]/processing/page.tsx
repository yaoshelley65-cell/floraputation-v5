"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://floraputation-v5-worker.onrender.com";

interface UploadStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  catalog_name: string | null;
  page_count: number | null;
  file_url: string | null;
  created_at: string;
  completed_at: string | null;
}

interface ProcessingStep {
  name: string;
  status: "complete" | "active" | "pending";
}

function getProcessingSteps(uploadStatus: string, pageCount: number | null): ProcessingStep[] {
  const steps: ProcessingStep[] = [
    { name: "Uploading PDF", status: "complete" },
    { name: "Page Classification", status: "pending" },
    { name: "L1: PyMuPDF Extraction", status: "pending" },
    { name: "L2: High-Res Rendering", status: "pending" },
    { name: "Image Post-Processing", status: "pending" },
    { name: "AI Naming & Scoring", status: "pending" },
    { name: "Deduplication Check", status: "pending" },
  ];

  if (uploadStatus === "pending") {
    steps[1].status = "active";
  } else if (uploadStatus === "processing") {
    steps[1].status = "complete";
    steps[2].status = "complete";
    steps[3].status = "active";
    if (pageCount && pageCount > 0) {
      steps[3].status = "complete";
      steps[4].status = "active";
    }
  } else if (uploadStatus === "completed") {
    steps.forEach((s) => (s.status = "complete"));
  }

  return steps;
}

export default function ProcessingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: uploadId } = use(params);
  const router = useRouter();
  const [statusData, setStatusData] = useState<UploadStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedCount, setExtractedCount] = useState(0);

  const pollStatus = useCallback(async () => {
    try {
      const response = await fetch(`${WORKER_URL}/status/${uploadId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }
      const data: UploadStatus = await response.json();
      setStatusData(data);

      // Fetch extracted images count
      const { count } = await supabase
        .from("extracted_images")
        .select("*", { count: "exact", head: true })
        .eq("upload_id", uploadId);
      setExtractedCount(count || 0);

      // Redirect when completed
      if (data.status === "completed") {
        setTimeout(() => {
          router.push(`/upload/${uploadId}/review`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch processing status.");
    }
  }, [uploadId, router]);

  useEffect(() => {
    // Initial fetch
    pollStatus();

    // Poll every 3 seconds
    const interval = setInterval(() => {
      pollStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [pollStatus]);

  const pageCount = statusData?.page_count || 0;
  const currentStatus = statusData?.status || "pending";
  const catalogName = statusData?.catalog_name || "Processing...";
  const steps = getProcessingSteps(currentStatus, statusData?.page_count ?? null);

  // Estimate progress based on status
  let progressPercent = 0;
  if (currentStatus === "pending") progressPercent = 10;
  else if (currentStatus === "processing") {
    progressPercent = pageCount > 0 ? Math.min(90, 20 + Math.round((extractedCount / Math.max(pageCount, 1)) * 70)) : 30;
  } else if (currentStatus === "completed") progressPercent = 100;
  else if (currentStatus === "failed") progressPercent = 0;

  return (
    <AppShell showSidebar={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 md:p-[48px]">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-primary-fixed/30 flex items-center justify-center mx-auto mb-6">
              <span className={cn(
                "material-symbols-outlined text-4xl",
                currentStatus === "completed" ? "text-confidence-high" : "text-primary",
                currentStatus === "failed" ? "text-confidence-low" : "",
                currentStatus !== "completed" && currentStatus !== "failed" && "animate-pulse"
              )}>
                {currentStatus === "completed" ? "check_circle" : currentStatus === "failed" ? "error" : "hourglass_top"}
              </span>
            </div>
            <h1 className="font-heading text-[24px] leading-[1.3] font-semibold text-on-surface mb-2">
              {currentStatus === "completed"
                ? "Processing Complete!"
                : currentStatus === "failed"
                ? "Processing Failed"
                : "Processing Your Catalogue"}
            </h1>
            <p className="font-body text-[16px] leading-[1.6] text-text-secondary">
              {catalogName}
            </p>
          </div>

          {error && (
            <div className="bg-confidence-low/10 border border-confidence-low/30 rounded-xl p-4 flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-confidence-low">error</span>
              <p className="font-body text-[14px] text-confidence-low">{error}</p>
            </div>
          )}

          {/* Progress Overview Card */}
          <div className="bg-surface rounded-xl border border-border-muted p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary uppercase">
                  Page Progress
                </p>
                <p className="font-heading text-[20px] leading-[1.4] font-semibold text-on-surface mt-1">
                  {pageCount > 0 ? `${pageCount} pages` : "Analyzing..."}
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary uppercase">
                  Status
                </p>
                <p className={cn(
                  "font-heading text-[20px] leading-[1.4] font-semibold mt-1",
                  currentStatus === "completed" ? "text-confidence-high" : "text-primary"
                )}>
                  {currentStatus === "pending" && "Queued"}
                  {currentStatus === "processing" && "Extracting"}
                  {currentStatus === "completed" && "Done"}
                  {currentStatus === "failed" && "Failed"}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out relative",
                  currentStatus === "failed" ? "bg-confidence-low" : "bg-primary"
                )}
                style={{ width: `${progressPercent}%` }}
              >
                {currentStatus !== "completed" && currentStatus !== "failed" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                )}
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
              {steps.map((step, idx) => (
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
                {extractedCount}
              </p>
              <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                Images Found
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border-muted p-4 text-center">
              <p className="font-heading text-[20px] leading-[1.4] font-semibold text-confidence-high">
                {pageCount}
              </p>
              <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                Pages
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border-muted p-4 text-center">
              <p className="font-heading text-[20px] leading-[1.4] font-semibold text-confidence-medium">
                {currentStatus === "completed" ? "0" : "—"}
              </p>
              <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                Need Review
              </p>
            </div>
          </div>

          {/* Action */}
          {currentStatus === "completed" && (
            <div className="text-center">
              <button
                onClick={() => router.push(`/upload/${uploadId}/review`)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-body text-[14px] font-bold hover:bg-primary/90 transition-colors shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">
                  visibility
                </span>
                Review Results
              </button>
            </div>
          )}

          {currentStatus === "failed" && (
            <div className="text-center">
              <button
                onClick={() => router.push("/upload")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border-muted rounded-lg font-body text-[14px] font-bold text-text-secondary hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
