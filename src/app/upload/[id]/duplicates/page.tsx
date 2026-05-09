"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout";
import { cn } from "@/lib/utils";

interface DuplicatePair {
  id: string;
  existing: {
    name: string;
    code: string;
    imageUrl: string;
    score: number;
    source: string;
  };
  new: {
    name: string;
    code: string;
    imageUrl: string;
    score: number;
    source: string;
  };
}

const duplicates: DuplicatePair[] = [
  {
    id: "dup-1",
    existing: {
      name: "Petunia Wave Purple Classic",
      code: "PT-WAV-001",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBjhoR17KORi3RIrdXh11HtBCUUQQ_77-FFhr12DGlLJl1f8cdjiau0G-sIVaUUaATAzA_W1rx6PmM22cgeD8_wZrMNxfB7fyK826YO2ciUG3udT0jywXONT-rPint7nECDrmz-Q2_yI4OTcVMF9Xia98nPPVVXRGYoKW7D5YfNhWWXxXha4pwe4QTOr31m71kacIdnFlx7-OTDHuBgPozORD281SYGrWkelQJbwM_8PEDHffcthseDR_7ZgPK-GiYP5gLAQj-N6p4",
      score: 85,
      source: "Evanthia Catalog 2025",
    },
    new: {
      name: "Petunia Wave Purple",
      code: "PT-WAV-001-B",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDii8r0parB6YoBMuAkJpR3H7OrgvaRIIb8hErTbSPVsHs1e1K20D9_96RDLXdYcBoz773mp6MasQ8mDJwRIc5mKfvxH80VxfCKLOWX5kB6N1m9PZsvvINW8KbOF8QvguCVjtC4IPI4lIdrdnod_h4pRiKFM3fTQc5dRHQP7tCrWQUfbFhI1UfT78F5f5yHwa4he97IRFrbgsVVABYOytHaZEvA9gXaXtFVGoTsAWvoKAZI9Le4fzMXRhkr2LPi2J9YjD_Im3IB-GU",
      score: 92,
      source: "Evanthia Spring 2026",
    },
  },
  {
    id: "dup-2",
    existing: {
      name: "Begonia Dragon Wing Red",
      code: "BG-DRG-042",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCb4kYQlLU3vFEBszz5Paa_8l1SQ4996HXs123nM3H2H1dyIpikRXG2JL9R6EdX5AzqWBtXSg_jXpBjwEweUYHZNyMOkM9yn-Pm27hXuV4D8-8WD_pf250oJJka9LaNAqQXtqLGfgW7uf5nGjGg7gnxMwQ4973NS_Aflv7BtMAgBrnUeZ_DyFJpPQoBmwhC3s2plQfxjp-xwf5rCwf_lWtm4sVnkOV_0N2EXcxXutUx3wsuIr6Zyj7Mr4Q9ev5KOuKbepmwvptX9qQ",
      score: 78,
      source: "Beekenkamp 2024",
    },
    new: {
      name: "Begonia Dragon Wing Red Flame",
      code: "BG-DRG-042",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBaPN4uLOgg_yR6ICWt8gKBaPCLhlaWZu8LI8o2RnMwTIgFJ9vAXi1RaAZt-JSDmctDrZWXtH5hi730TwNN8K_7SYrdq6DXqPzP7b3L9qsQq8Xml80JlHuCuC4T2NZH6TliN3pAUV-8h-CXxGiv-sxmtkoAK3kYeJ81-J5NLkOiOPAl4vYIQWbe-xcpArCfbh0DXS30X3gCa2AzYOBIRiFDQybCMuF5HlOz7MAN1VmlK-KTJ-EZSjtVQBKG6zqReDuup5zbOvmWzU4",
      score: 94,
      source: "Evanthia Spring 2026",
    },
  },
];

export default function DuplicatesPage() {
  const [selections, setSelections] = useState<
    Record<string, { image: "existing" | "new"; name: "existing" | "new" }>
  >({});

  const handleSelect = (
    dupId: string,
    field: "image" | "name",
    choice: "existing" | "new"
  ) => {
    setSelections((prev) => ({
      ...prev,
      [dupId]: {
        ...prev[dupId],
        [field]: choice,
      },
    }));
  };

  return (
    <AppShell showSidebar={false}>
      <div className="p-4 md:p-[48px] max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-[24px] leading-[1.3] font-semibold text-on-surface mb-2">
            Deduplication Review
          </h1>
          <p className="font-body text-[16px] leading-[1.6] text-text-secondary">
            We found {duplicates.length} potential duplicates. Choose which
            image and name to keep for each variety.
          </p>
        </div>

        {/* Duplicate Cards */}
        <div className="space-y-8">
          {duplicates.map((dup) => {
            const sel = selections[dup.id] || {
              image: "new",
              name: "new",
            };
            return (
              <div
                key={dup.id}
                className="bg-surface rounded-xl border border-border-muted shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-muted bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      compare
                    </span>
                    <span className="font-body text-[14px] leading-[1.5] font-medium text-text-primary">
                      Potential Duplicate: {dup.existing.code}
                    </span>
                  </div>
                  <span className="font-body text-[11px] leading-[1.2] text-text-secondary bg-surface-container px-3 py-1 rounded-full">
                    Match confidence: 94%
                  </span>
                </div>

                {/* Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-px bg-border-muted">
                  {/* Existing */}
                  <div className="bg-surface p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary uppercase">
                        Existing Record
                      </span>
                      <span className="font-body text-[11px] leading-[1.2] text-text-secondary bg-surface-container px-2 py-0.5 rounded">
                        {dup.existing.source}
                      </span>
                    </div>

                    {/* Image Selection */}
                    <button
                      onClick={() =>
                        handleSelect(dup.id, "image", "existing")
                      }
                      className={cn(
                        "w-full aspect-square rounded-lg border-2 overflow-hidden mb-4 transition-all",
                        sel.image === "existing"
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border-muted hover:border-primary/50"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dup.existing.imageUrl}
                        alt={dup.existing.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {sel.image === "existing" && (
                      <div className="flex items-center gap-1 mb-3 text-primary">
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                        <span className="font-body text-[11px] leading-[1.2] font-bold">
                          Image selected
                        </span>
                      </div>
                    )}

                    {/* Name Selection */}
                    <button
                      onClick={() =>
                        handleSelect(dup.id, "name", "existing")
                      }
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        sel.name === "existing"
                          ? "border-primary bg-primary-fixed/10"
                          : "border-border-muted hover:border-primary/50"
                      )}
                    >
                      <p className="font-body text-[14px] leading-[1.5] font-medium text-text-primary">
                        {dup.existing.name}
                      </p>
                      <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                        Code: {dup.existing.code} · Score: {dup.existing.score}
                      </p>
                    </button>
                  </div>

                  {/* New */}
                  <div className="bg-surface p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-primary uppercase">
                        New Upload
                      </span>
                      <span className="font-body text-[11px] leading-[1.2] text-text-secondary bg-primary-fixed/20 px-2 py-0.5 rounded">
                        {dup.new.source}
                      </span>
                    </div>

                    {/* Image Selection */}
                    <button
                      onClick={() => handleSelect(dup.id, "image", "new")}
                      className={cn(
                        "w-full aspect-square rounded-lg border-2 overflow-hidden mb-4 transition-all",
                        sel.image === "new"
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border-muted hover:border-primary/50"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dup.new.imageUrl}
                        alt={dup.new.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {sel.image === "new" && (
                      <div className="flex items-center gap-1 mb-3 text-primary">
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                        <span className="font-body text-[11px] leading-[1.2] font-bold">
                          Image selected
                        </span>
                      </div>
                    )}

                    {/* Name Selection */}
                    <button
                      onClick={() => handleSelect(dup.id, "name", "new")}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        sel.name === "new"
                          ? "border-primary bg-primary-fixed/10"
                          : "border-border-muted hover:border-primary/50"
                      )}
                    >
                      <p className="font-body text-[14px] leading-[1.5] font-medium text-text-primary">
                        {dup.new.name}
                      </p>
                      <p className="font-body text-[11px] leading-[1.2] text-text-secondary mt-1">
                        Code: {dup.new.code} · Score: {dup.new.score}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface rounded-xl border border-border-muted p-6 shadow-sm">
          <div>
            <p className="font-body text-[14px] leading-[1.5] text-text-primary font-medium">
              {Object.keys(selections).length} of {duplicates.length} resolved
            </p>
            <p className="font-body text-[13px] leading-[1.4] text-text-secondary">
              Select preferred image and name for each duplicate.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-lg font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary border border-outline-variant hover:bg-surface-container transition-colors">
              Skip All (Keep Existing)
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              Confirm Selections
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
