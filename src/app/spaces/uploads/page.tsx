"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { supabase } from "@/lib/supabase";

interface Upload {
  id: string;
  catalog_name: string;
  status: string;
  page_count: number | null;
  file_size: number | null;
  created_at: string;
  completed_at: string | null;
  breeder_name: string | null;
}

interface ExtractedCount {
  upload_id: string;
  count: number;
}

export default function MyUploadsPage() {
  const router = useRouter();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [extractedCounts, setExtractedCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadUploads();
  }, []);

  async function loadUploads() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.replace("/login");
      return;
    }

    const { data } = await supabase
      .from("uploads")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    setUploads(data || []);

    // Get extracted image counts for each upload
    if (data && data.length > 0) {
      const counts: Record<string, number> = {};
      for (const upload of data) {
        const { count } = await supabase
          .from("extracted_images")
          .select("*", { count: "exact", head: true })
          .eq("upload_id", upload.id);
        counts[upload.id] = count || 0;
      }
      setExtractedCounts(counts);
    }

    setLoading(false);
  }

  function formatFileSize(bytes: number | null) {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed": return "bg-confidence-high/10 text-confidence-high";
      case "processing": return "bg-primary/10 text-primary";
      case "failed": return "bg-confidence-low/10 text-confidence-low";
      default: return "bg-surface-container text-text-secondary";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "completed": return "check_circle";
      case "processing": return "sync";
      case "failed": return "error";
      default: return "schedule";
    }
  }

  function handleUploadClick(upload: Upload) {
    if (upload.status === "completed") {
      router.push(`/upload/${upload.id}/review`);
    } else if (upload.status === "processing") {
      router.push(`/upload/${upload.id}/processing`);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 md:p-[48px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push("/spaces")}
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-heading text-[36px] leading-[1.2] font-bold text-primary">
            My Uploads
          </h1>
        </div>
        <p className="font-body text-[16px] leading-[1.6] text-text-secondary mb-8 ml-10">
          All catalogues you&apos;ve uploaded for variety extraction.
        </p>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/upload")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold rounded-full hover:bg-primary/90 transition-all shadow-md"
          >
            <span className="material-symbols-outlined">add</span>
            Upload New Catalogue
          </button>
        </div>

        {uploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-surface rounded-3xl border border-border-muted border-dashed">
            <span className="material-symbols-outlined text-5xl text-outline">
              cloud_upload
            </span>
            <p className="font-body text-[16px] text-text-secondary">
              No catalogues uploaded yet.
            </p>
            <button
              onClick={() => router.push("/upload")}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-body text-[13px] font-semibold hover:bg-primary/90 transition-colors"
            >
              Upload Your First Catalogue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                onClick={() => handleUploadClick(upload)}
                className="bg-surface rounded-2xl border border-border-muted p-5 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        picture_as_pdf
                      </span>
                    </div>
                    <div>
                      <h3 className="font-heading text-[16px] font-bold text-text-primary group-hover:text-primary transition-colors">
                        {upload.catalog_name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-body text-[12px] text-text-secondary">
                          {formatFileSize(upload.file_size)}
                        </span>
                        {upload.page_count && (
                          <span className="font-body text-[12px] text-text-secondary">
                            {upload.page_count} pages
                          </span>
                        )}
                        <span className="font-body text-[12px] text-text-secondary">
                          {new Date(upload.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Extracted count */}
                    {extractedCounts[upload.id] > 0 && (
                      <div className="text-right">
                        <p className="font-heading text-[18px] font-bold text-primary">
                          {extractedCounts[upload.id]}
                        </p>
                        <p className="font-body text-[11px] text-text-secondary">
                          images
                        </p>
                      </div>
                    )}

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1 font-body text-[12px] px-3 py-1 rounded-full ${getStatusColor(upload.status)}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {getStatusIcon(upload.status)}
                      </span>
                      {upload.status}
                    </span>

                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
