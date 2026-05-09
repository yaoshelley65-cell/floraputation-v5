"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import {
  supabase,
  getUserSpaces,
  createSpace,
  deleteSpace,
  type Space,
} from "@/lib/supabase";

export default function SpacesPage() {
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDesc, setNewSpaceDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
        loadSpaces(data.user.id);
      }
    });
  }, [router]);

  async function loadSpaces(userId: string) {
    setLoading(true);
    const data = await getUserSpaces(userId);
    setSpaces(data);
    setLoading(false);
  }

  async function handleCreateSpace() {
    if (!newSpaceName.trim() || !user) return;
    setCreating(true);
    const space = await createSpace(user.id, newSpaceName, newSpaceDesc);
    if (space) {
      setSpaces([space, ...spaces]);
      setShowCreateModal(false);
      setNewSpaceName("");
      setNewSpaceDesc("");
    }
    setCreating(false);
  }

  async function handleDeleteSpace(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this space?")) return;
    const success = await deleteSpace(id);
    if (success) {
      setSpaces(spaces.filter((s) => s.id !== id));
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
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="font-heading text-[48px] leading-[1.2] font-bold text-primary mb-2">
              My Spaces
            </h1>
            <p className="font-body text-[16px] leading-[1.6] text-text-secondary">
              Organize your selected varieties into custom collections.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold rounded-full hover:bg-primary/90 transition-all shadow-md"
          >
            <span className="material-symbols-outlined">add</span>
            New Space
          </button>
        </div>

        {spaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-surface rounded-3xl border border-border-muted border-dashed">
            <span className="material-symbols-outlined text-5xl text-outline">
              folder_open
            </span>
            <p className="font-body text-[16px] text-text-secondary">
              You haven&apos;t created any spaces yet.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-body text-[13px] font-semibold hover:bg-primary/90 transition-colors"
            >
              Create Your First Space
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {spaces.map((space) => (
              <div
                key={space.id}
                onClick={() => router.push(`/spaces/${space.id}`)}
                className="bg-surface rounded-2xl border border-border-muted p-6 hover:shadow-lg transition-all cursor-pointer group relative"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">
                    filter_vintage
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-1">
                  {space.space_name}
                </h3>
                <p className="font-body text-[14px] text-text-secondary line-clamp-2 mb-4">
                  {space.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-muted">
                  <span className="font-body text-[12px] text-text-secondary">
                    Created {new Date(space.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => handleDeleteSpace(space.id, e)}
                    className="text-outline hover:text-confidence-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-border-muted p-8">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Create New Space
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-body text-[13px] font-bold text-text-secondary mb-1.5">
                    Space Name
                  </label>
                  <input
                    type="text"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    placeholder="e.g. Spring 2024 Selection"
                    className="w-full bg-surface-container-low border border-border-muted rounded-lg px-4 py-2.5 font-body text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block font-body text-[13px] font-bold text-text-secondary mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newSpaceDesc}
                    onChange={(e) => setNewSpaceDesc(e.target.value)}
                    placeholder="What is this collection for?"
                    rows={3}
                    className="w-full bg-surface-container-low border border-border-muted rounded-lg px-4 py-2.5 font-body text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 rounded-full font-body text-[13px] font-bold text-text-secondary hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSpace}
                  disabled={!newSpaceName.trim() || creating}
                  className="px-8 py-2.5 bg-primary text-white rounded-full font-body text-[13px] font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Space"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
