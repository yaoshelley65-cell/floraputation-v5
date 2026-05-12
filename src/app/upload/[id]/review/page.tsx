"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { cn } from "@/lib/utils";
import { supabase, type ExtractedImage } from "@/lib/supabase";

type ConfidenceLevel = "high" | "medium" | "low";

function getConfidenceLevel(score: number | null): ConfidenceLevel {
  if (score === null) return "low";
  if (score >= 95) return "high";
  if (score >= 70) return "medium";
  return "low";
}

function getConfidenceLabel(level: ConfidenceLevel): string {
  if (level === "high") return "High Confidence";
  if (level === "medium") return "Needs Review";
  return "Low Confidence";
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: uploadId } = use(params);
  const router = useRouter();
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    detected_crop: "",
    detected_series: "",
    detected_variety: "",
    detected_code: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchImages = useCallback(async () => {
    const { data, error } = await supabase
      .from("extracted_images")
      .select("*")
      .eq("upload_id", uploadId)
      .order("page_number", { ascending: true });

    if (error) {
      console.error("Error fetching extracted images:", error);
    } else {
      setImages((data as ExtractedImage[]) || []);
    }
    setLoading(false);
  }, [uploadId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map((img) => img.id)));
    }
  };

  const startEditing = (img: ExtractedImage) => {
    setEditingId(img.id);
    setEditForm({
      detected_crop: img.detected_crop || "",
      detected_series: img.detected_series || "",
      detected_variety: img.detected_variety || "",
      detected_code: img.detected_code || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ detected_crop: "", detected_series: "", detected_variety: "", detected_code: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);

    const { error } = await supabase
      .from("extracted_images")
      .update({
        detected_crop: editForm.detected_crop || null,
        detected_series: editForm.detected_series || null,
        detected_variety: editForm.detected_variety || null,
        detected_code: editForm.detected_code || null,
      })
      .eq("id", editingId);

    if (!error) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingId
            ? {
                ...img,
                detected_crop: editForm.detected_crop || null,
                detected_series: editForm.detected_series || null,
                detected_variety: editForm.detected_variety || null,
                detected_code: editForm.detected_code || null,
              }
            : img
        )
      );
      setEditingId(null);
      showToast("Changes saved successfully");
    } else {
      console.error("Error saving edit:", error);
      showToast("Failed to save changes", "error");
    }
    setSaving(false);
  };

  // Create variety records from validated extracted images
  const createVarietiesFromImages = async (imagesToConfirm: ExtractedImage[]) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || null;

    let created = 0;
    let skipped = 0;

    for (const img of imagesToConfirm) {
      // Skip images without a variety name
      if (!img.detected_variety && !img.detected_crop) {
        skipped++;
        continue;
      }

      // Check for existing variety with same crop+series+variety to avoid duplicates
      let query = supabase.from("varieties").select("id");
      if (img.detected_crop) query = query.eq("crop", img.detected_crop);
      if (img.detected_series) query = query.eq("series", img.detected_series);
      if (img.detected_variety) query = query.eq("variety", img.detected_variety);

      const { data: existing } = await query.limit(1);

      if (existing && existing.length > 0) {
        // Link existing variety to this extracted image
        await supabase
          .from("extracted_images")
          .update({ variety_id: existing[0].id })
          .eq("id", img.id);
        skipped++;
        continue;
      }

      // Create new variety record
      const { data: newVariety, error: insertError } = await supabase
        .from("varieties")
        .insert({
          crop: img.detected_crop,
          series: img.detected_series,
          variety: img.detected_variety,
          code: img.detected_code,
          image_url: img.processed_image_url,
          quality_score: img.quality_score,
          source_upload_id: uploadId,
          created_by: userId,
        })
        .select("id")
        .single();

      if (!insertError && newVariety) {
        // Link variety_id back to extracted_image
        await supabase
          .from("extracted_images")
          .update({ variety_id: newVariety.id })
          .eq("id", img.id);
        created++;
      } else {
        console.error("Error creating variety:", insertError);
      }
    }

    return { created, skipped };
  };

  const confirmAndCreateVarieties = async (ids: string[]) => {
    setSaving(true);

    // Step 1: Mark as validated
    const { error } = await supabase
      .from("extracted_images")
      .update({ validated: true })
      .in("id", ids);

    if (error) {
      console.error("Error confirming:", error);
      showToast("Failed to confirm images", "error");
      setSaving(false);
      return;
    }

    // Step 2: Create variety records
    const imagesToConfirm = images.filter((img) => ids.includes(img.id));
    const { created, skipped } = await createVarietiesFromImages(imagesToConfirm);

    // Step 3: Update local state
    setImages((prev) =>
      prev.map((img) => (ids.includes(img.id) ? { ...img, validated: true } : img))
    );
    setSelectedIds(new Set());

    // Step 4: Show success toast
    const total = ids.length;
    showToast(
      `Confirmed ${total} images. ${created} new varieties added to database${skipped > 0 ? `, ${skipped} duplicates skipped` : ""}.`
    );

    setSaving(false);

    // Step 5: If all images are now validated, redirect after a short delay
    const allValidated = images.every((img) => ids.includes(img.id) || img.validated);
    if (allValidated) {
      setTimeout(() => {
        router.push("/search");
      }, 2500);
    }
  };

  const batchConfirm = async () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : images.map((img) => img.id);
    await confirmAndCreateVarieties(ids);
  };

  const confirmAll = async () => {
    const allIds = images.map((img) => img.id);
    await confirmAndCreateVarieties(allIds);
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setSaving(true);
    const ids = Array.from(selectedIds);

    const { error } = await supabase
      .from("extracted_images")
      .delete()
      .in("id", ids);

    if (!error) {
      setImages((prev) => prev.filter((img) => !ids.includes(img.id)));
      setSelectedIds(new Set());
      showToast(`Deleted ${ids.length} images`);
    } else {
      console.error("Error deleting:", error);
      showToast("Failed to delete images", "error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AppShell showSidebar={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showSidebar={false}>
      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-lg border transition-all animate-in slide-in-from-top-2 duration-300",
          toast.type === "success"
            ? "bg-confidence-high/10 border-confidence-high/30 text-confidence-high"
            : "bg-confidence-low/10 border-confidence-low/30 text-confidence-low"
        )}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-body text-[14px] font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="p-4 md:p-[48px] pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="font-heading text-[24px] leading-[1.3] font-semibold text-on-surface mb-1">
              Human Validation
            </h1>
            <p className="font-body text-[14px] leading-[1.5] text-text-secondary">
              Review AI-extracted varieties. Low confidence items are highlighted.
              {images.length > 0 && ` (${images.length} items, ${images.filter(i => i.validated).length} validated)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/spaces/uploads")}
              className="px-4 py-2 rounded-lg border border-outline-variant text-text-secondary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-surface-container-highest transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              My Uploads
            </button>
            <button
              onClick={confirmAll}
              disabled={saving || images.length === 0 || images.every(i => i.validated)}
              className="px-6 py-2 rounded-lg bg-primary text-on-primary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {saving ? "sync" : "check_circle"}
              </span>
              {saving ? "Processing..." : images.every(i => i.validated) ? "All Confirmed" : "Confirm All"}
            </button>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="bg-surface rounded-xl border border-border-muted p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-text-secondary mb-4">
              image_not_supported
            </span>
            <p className="font-body text-[16px] text-text-secondary">
              No extracted images found for this upload.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="bg-surface rounded-xl border border-border-muted overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[48px_56px_2fr_1.5fr_1fr_1.5fr_1fr] items-center px-4 py-3 border-b border-border-muted bg-surface-container-low">
              <div className="flex items-center justify-center">
                <input
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                  type="checkbox"
                  checked={selectedIds.size === images.length && images.length > 0}
                  onChange={toggleSelectAll}
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
            {images.map((img) => {
              const confidence = getConfidenceLevel(img.confidence_score);
              const isEditing = editingId === img.id;

              return (
                <div key={img.id}>
                  <div
                    className={cn(
                      "grid grid-cols-[48px_56px_2fr_1.5fr_1fr_1.5fr_1fr] items-center px-4 py-2 border-b border-border-muted hover:bg-surface-container-lowest transition-colors group",
                      img.validated && "bg-primary-fixed/10 hover:bg-primary-fixed/20",
                      confidence === "low" && !img.validated && "shadow-[inset_4px_0_0_0_#E6A2A2]"
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <input
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                        type="checkbox"
                        checked={selectedIds.has(img.id)}
                        onChange={() => toggleSelect(img.id)}
                      />
                    </div>
                    <div>
                      <div className="w-10 h-10 rounded border border-border-muted overflow-hidden bg-surface-container">
                        {img.processed_image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            alt={img.detected_variety || "Extracted"}
                            className="w-full h-full object-cover"
                            src={img.processed_image_url}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] text-text-secondary">
                              image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-[13px] leading-[1.4] font-medium text-text-primary">
                        {img.detected_crop || "Unknown"}{" "}
                        {img.detected_series ? `${img.detected_series} ` : ""}
                        {img.detected_variety ? `'${img.detected_variety}'` : ""}
                      </span>
                      <span
                        className={cn(
                          "font-body text-[11px] leading-[1.2] text-text-secondary",
                          confidence === "low" && !img.validated && "text-error"
                        )}
                      >
                        {img.detected_code || `Page ${img.page_number || "?"}`}
                        {img.validated && (
                          <span className="text-confidence-high"> • ✓ Validated</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          confidence === "high" && "bg-confidence-high",
                          confidence === "medium" && "bg-confidence-medium",
                          confidence === "low" && "bg-confidence-low"
                        )}
                      />
                      <span className="font-body text-[13px] leading-[1.4] text-text-secondary">
                        {getConfidenceLabel(confidence)}
                      </span>
                    </div>
                    <div>
                      <span
                        className={cn(
                          "px-2 py-1 rounded font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold",
                          confidence === "low"
                            ? "bg-error-container text-on-error-container"
                            : "bg-surface-container text-text-primary"
                        )}
                      >
                        {img.quality_score ?? "—"}
                      </span>
                    </div>
                    <div className="font-body text-[13px] leading-[1.4] text-text-secondary truncate pr-4">
                      Page {img.page_number || "?"}
                    </div>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(img)}
                        className="w-8 h-8 rounded flex items-center justify-center text-text-secondary hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form */}
                  {isEditing && (
                    <div className="px-4 py-4 bg-surface-container-low border-b border-border-muted">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div>
                          <label className="font-body text-[11px] text-text-secondary block mb-1">
                            Crop
                          </label>
                          <input
                            type="text"
                            value={editForm.detected_crop}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, detected_crop: e.target.value }))
                            }
                            className="w-full border border-border-muted rounded px-2 py-1.5 text-[13px] font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[11px] text-text-secondary block mb-1">
                            Series
                          </label>
                          <input
                            type="text"
                            value={editForm.detected_series}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, detected_series: e.target.value }))
                            }
                            className="w-full border border-border-muted rounded px-2 py-1.5 text-[13px] font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[11px] text-text-secondary block mb-1">
                            Variety
                          </label>
                          <input
                            type="text"
                            value={editForm.detected_variety}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, detected_variety: e.target.value }))
                            }
                            className="w-full border border-border-muted rounded px-2 py-1.5 text-[13px] font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[11px] text-text-secondary block mb-1">
                            Code
                          </label>
                          <input
                            type="text"
                            value={editForm.detected_code}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, detected_code: e.target.value }))
                            }
                            className="w-full border border-border-muted rounded px-2 py-1.5 text-[13px] font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1.5 rounded text-[12px] font-body font-bold text-text-secondary hover:bg-surface-container transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          className="px-4 py-1.5 rounded bg-primary text-white text-[12px] font-body font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Batch Action Bar */}
      {images.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface-container/95 backdrop-blur-md border-t border-border-muted p-4 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold">
              {selectedIds.size}
            </div>
            <span className="font-body text-[14px] leading-[1.5] text-text-primary font-medium">
              Items selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={deleteSelected}
              disabled={selectedIds.size === 0 || saving}
              className="px-4 py-2 rounded-lg border border-outline-variant text-text-secondary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-surface-container-highest transition-colors flex items-center gap-2 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
              <span className="hidden sm:inline">Delete Selected</span>
            </button>
            <button
              onClick={batchConfirm}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-primary text-on-primary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {saving ? "sync" : "check_circle"}
              </span>
              {saving ? "Processing..." : selectedIds.size > 0 ? "Batch Confirm" : "Confirm All"}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
