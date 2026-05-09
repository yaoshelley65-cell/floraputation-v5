"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate upload
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const simulateUpload = (name: string) => {
    setFileName(name);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <AppShell showSidebar={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 md:p-[48px]">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-heading text-[48px] leading-[1.2] font-bold text-primary mb-3">
              Upload Catalogue
            </h1>
            <p className="font-body text-[16px] leading-[1.6] text-text-secondary max-w-md mx-auto">
              Upload a PDF flower variety catalogue. Our AI will extract all
              variety images and metadata automatically.
            </p>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary-fixed/20 scale-[1.02]"
                : "border-border-muted bg-surface hover:border-primary/50 hover:bg-surface-container-low"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-fixed/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary">
                  cloud_upload
                </span>
              </div>
              <div>
                <p className="font-body text-[16px] leading-[1.6] text-on-surface font-medium mb-1">
                  Drag &amp; drop your PDF here
                </p>
                <p className="font-body text-[13px] leading-[1.4] text-text-secondary">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-body text-[11px] leading-[1.2] text-text-secondary bg-surface-container px-3 py-1 rounded-full">
                  PDF only
                </span>
                <span className="font-body text-[11px] leading-[1.2] text-text-secondary bg-surface-container px-3 py-1 rounded-full">
                  Max 500MB
                </span>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress !== null && (
            <div className="mt-6 bg-surface rounded-xl border border-border-muted p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-[20px]">
                    description
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-body text-[14px] leading-[1.5] text-text-primary font-medium">
                    {fileName}
                  </p>
                  <p className="font-body text-[11px] leading-[1.2] text-text-secondary">
                    {uploadProgress < 100
                      ? "Uploading..."
                      : "Upload complete!"}
                  </p>
                </div>
                <span className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-primary">
                  {uploadProgress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              {uploadProgress === 100 && (
                <div className="mt-4 flex justify-end">
                  <button className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      play_arrow
                    </span>
                    Start Processing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-surface rounded-xl border border-border-muted p-5">
              <span className="material-symbols-outlined text-primary mb-3 block">
                auto_awesome
              </span>
              <h3 className="font-body text-[14px] leading-[1.5] font-medium text-text-primary mb-1">
                AI Extraction
              </h3>
              <p className="font-body text-[13px] leading-[1.4] text-text-secondary">
                Automatically extracts variety images and metadata from PDF
                pages.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border-muted p-5">
              <span className="material-symbols-outlined text-primary mb-3 block">
                verified
              </span>
              <h3 className="font-body text-[14px] leading-[1.5] font-medium text-text-primary mb-1">
                Quality Scoring
              </h3>
              <p className="font-body text-[13px] leading-[1.4] text-text-secondary">
                Each image is scored for resolution, clarity, and composition.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border-muted p-5">
              <span className="material-symbols-outlined text-primary mb-3 block">
                psychology
              </span>
              <h3 className="font-body text-[14px] leading-[1.5] font-medium text-text-primary mb-1">
                Smart Naming
              </h3>
              <p className="font-body text-[13px] leading-[1.4] text-text-secondary">
                AI detects crop, series, variety name, and breeder code
                automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
