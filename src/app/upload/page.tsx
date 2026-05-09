"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  supabase,
  VALID_INVITATION_CODE,
  createUploadRecord,
  uploadCatalogPDF,
  updateUploadFileUrl,
  getUserProfile,
  updateInvitationCode,
} from "@/lib/supabase";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
        getUserProfile(data.user.id).then((profile) => {
          if (profile?.invitation_code === VALID_INVITATION_CODE) {
            setIsVerified(true);
          }
          setLoading(false);
        });
      }
    });
  }, [router]);

  const handleVerify = async () => {
    if (inviteCode === VALID_INVITATION_CODE) {
      const success = await updateInvitationCode(user.id, inviteCode);
      if (success) {
        setIsVerified(true);
        setError(null);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } else {
      setError("Invalid invitation code.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError("File size exceeds 500MB limit.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Create database record
      const uploadRecord = await createUploadRecord(user.id, file.name, file.size);
      if (!uploadRecord) throw new Error("Failed to create upload record.");

      // 2. Upload to Storage
      const publicUrl = await uploadCatalogPDF(user.id, file, uploadRecord.id);
      if (!publicUrl) throw new Error("Failed to upload file to storage.");

      // 3. Update record with URL
      await updateUploadFileUrl(uploadRecord.id, publicUrl);

      // 4. Trigger worker
      try {
        await fetch(`${process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8000'}/process/${uploadRecord.id}`, { 
          method: 'POST',
          mode: 'no-cors' // Worker might be on different domain
        });
      } catch (e) {
        console.warn("Worker trigger failed, but upload succeeded:", e);
      }

      router.push(`/upload/${uploadRecord.id}/processing`);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
      setUploading(false);
    }
  };

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
      <div className="max-w-4xl mx-auto p-4 md:p-12">
        <h1 className="font-heading text-[40px] font-bold text-primary mb-2">
          Upload Catalogue
        </h1>
        <p className="font-body text-[16px] text-text-secondary mb-10">
          Upload a flower variety PDF catalog to extract structured data.
        </p>

        {!isVerified ? (
          <div className="bg-surface rounded-2xl border border-border-muted p-8 shadow-sm max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">
                lock
              </span>
              <h2 className="font-heading text-xl font-bold text-text-primary">
                Verification Required
              </h2>
            </div>
            <p className="font-body text-[14px] text-text-secondary mb-6">
              Please enter your invitation code to enable catalog uploads.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invitation code"
                className="w-full bg-surface-container-low border border-border-muted rounded-lg px-4 py-3 font-mono text-[16px] tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {error && (
                <p className="text-confidence-low text-[13px] font-body">
                  {error}
                </p>
              )}
              <button
                onClick={handleVerify}
                className="w-full bg-primary text-white rounded-lg py-3 font-body font-bold hover:bg-primary/90 transition-colors"
              >
                Verify & Unlock
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upload Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all",
                file
                  ? "border-primary bg-primary/5"
                  : "border-border-muted bg-surface hover:border-primary/50"
              )}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    {file ? "description" : "upload_file"}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                  {file ? file.name : "Select PDF Catalogue"}
                </h3>
                <p className="font-body text-[14px] text-text-secondary text-center max-w-xs">
                  {file
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Drag and drop your PDF here, or click to browse. Max 500MB."}
                </p>
              </label>
            </div>

            {error && (
              <div className="bg-confidence-low/10 border border-confidence-low/30 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-confidence-low">
                  error
                </span>
                <p className="font-body text-[14px] text-confidence-low">
                  {error}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setFile(null)}
                disabled={!file || uploading}
                className="px-6 py-3 rounded-full font-body text-[14px] font-bold text-text-secondary hover:bg-surface-container transition-colors disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-8 py-3 bg-primary text-white rounded-full font-body text-[14px] font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">
                      progress_activity
                    </span>
                    Uploading...
                  </>
                ) : (
                  "Start Processing"
                )}
              </button>
            </div>

            {/* Guidelines */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-border-muted">
              <h4 className="font-heading text-[14px] font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  info
                </span>
                Upload Guidelines
              </h4>
              <ul className="space-y-3">
                {[
                  "Only PDF files are supported for extraction.",
                  "High-resolution PDFs (300dpi) yield better extraction results.",
                  "Processing time depends on page count (approx. 2s per page).",
                  "All extracted data will be public by default.",
                ].map((text, i) => (
                  <li
                    key={i}
                    className="font-body text-[13px] text-text-secondary flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
