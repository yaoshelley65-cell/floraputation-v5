export const spaces = [
  { id: "1", name: "Primary Space", icon: "filter_vintage", filled: true },
  { id: "2", name: "Greenhouse A", icon: "domain", filled: false },
  { id: "3", name: "Research Plot", icon: "science", filled: false },
  { id: "4", name: "Archive", icon: "inventory_2", filled: false },
];

export type ConfidenceLevel = "high" | "medium" | "low";

export interface Variety {
  id: string;
  crop: string;
  series: string;
  variety: string;
  code: string;
  confidence: ConfidenceLevel;
  score: number;
  imageUrl: string;
  source: string;
  inSpace?: boolean;
}

export const varieties: Variety[] = [
  {
    id: "VAR-0921-A",
    crop: "Rosa",
    series: "Alba",
    variety: "Maxima",
    code: "RS-ALB-001",
    confidence: "high",
    score: 98,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDQTQKNecjNuZcxjub0tK5_cMcUzwjXDxEEVNGqxBuKLp3En1ltAA27mHlS_Ye1U5f-K78sa93hzvuI4k5ZKtlYgKwKmwL-hyZo3Hmq9J_MIerh291FctF9hXZaLmh_1Bk2Q20ZMMaL-YrFMBq-UnmOwzF2YKsVmHoq-1ossI6_vk882rLfd6CWpvzBYRhHb353oxPFf42ajSMp6LLkwYYxfpUwZelvWozjRiaK5SK5geodxHbfdAU2f1YVu-m4T0A_gslCuAd5dU",
    source: "Greenhouse Section B",
    inSpace: true,
  },
  {
    id: "VAR-0922-B",
    crop: "Phalaenopsis",
    series: "Gem",
    variety: "Purple Gem",
    code: "PH-GEM-042",
    confidence: "medium",
    score: 74,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeKqw9oEwWJvmEZPb3bOkvtLwsT91dbnniL3NuMQxz8A4hXKi5t9k_5vYl6j1-Qun1xN-eyY3Tgm1s7rcPxRd7zpa6famZ_vW1SRtZUFM1ZZBJrz3y4SE_4xI45YIVDmBWxWV93peyq4z8uuBItzvKKJRvlfJHkx6-D_L9DxmpLrygHm-6fTavqe1FdZDWGnWvneAiOuqZEOhySne44hQewj3EYK9-k7ZF2mvcUfhIo_OTEZ0TY0Ji2BTcMl48aJJCIlTnesPE4HM",
    source: "External Vendor Batch",
    inSpace: true,
  },
  {
    id: "VAR-0923-C",
    crop: "Unknown",
    series: "Echeveria",
    variety: "Unknown Echeveria",
    code: "UNK-001",
    confidence: "low",
    score: 32,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbPVkZr9g8tTXZyENDt0SqG7mqJHmsmDMWXYcotzt3oTrVAvH0Ou30GEKMint6ReiCE-Sm7kMNnJgchG9x5qxEsQKte1V9_oSXCRicYlCgQ8O0ZzLd8Dd0-fKKJKn47szt5TLLsEKLzpfY0UXq4a0HUVbPN9F1ivalOrG4UWV6uRXYzX1vruLcXekh_IeL9gUxGJlwen4exsObWax2d_LpcH5FGTStrH25V4Vm6eyzaNF4_TBaN2ClY0ynyeuvlpDWm5xs-EUp4TM",
    source: "Field Uploads - Sector 4",
    inSpace: false,
  },
  {
    id: "PT-WAV-001",
    crop: "Petunia",
    series: "Wave",
    variety: "Purple Classic",
    code: "PT-WAV-001",
    confidence: "high",
    score: 98,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjhoR17KORi3RIrdXh11HtBCUUQQ_77-FFhr12DGlLJl1f8cdjiau0G-sIVaUUaATAzA_W1rx6PmM22cgeD8_wZrMNxfB7fyK826YO2ciUG3udT0jywXONT-rPint7nECDrmz-Q2_yI4OTcVMF9Xia98nPPVVXRGYoKW7D5YfNhWWXxXha4pwe4QTOr31m71kacIdnFlx7-OTDHuBgPozORD281SYGrWkelQJbwM_8PEDHffcthseDR_7ZgPK-GiYP5gLAQj-N6p4",
    source: "Greenhouse A",
    inSpace: true,
  },
  {
    id: "BG-DRG-042",
    crop: "Begonia",
    series: "Dragon Wing",
    variety: "Red Flame",
    code: "BG-DRG-042",
    confidence: "medium",
    score: 75,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb4kYQlLU3vFEBszz5Paa_8l1SQ4996HXs123nM3H2H1dyIpikRXG2JL9R6EdX5AzqWBtXSg_jXpBjwEweUYHZNyMOkM9yn-Pm27hXuV4D8-8WD_pf250oJJka9LaNAqQXtqLGfgW7uf5nGjGg7gnxMwQ4973NS_Aflv7BtMAgBrnUeZ_DyFJpPQoBmwhC3s2plQfxjp-xwf5rCwf_lWtm4sVnkOV_0N2EXcxXutUx3wsuIr6Zyj7Mr4Q9ev5KOuKbepmwvptX9qQ",
    source: "Greenhouse A",
    inSpace: true,
  },
  {
    id: "DH-MYS-011",
    crop: "Dahlia",
    series: "Mystic",
    variety: "Illusion Pink",
    code: "DH-MYS-011",
    confidence: "high",
    score: 92,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaPN4uLOgg_yR6ICWt8gKBaPCLhlaWZu8LI8o2RnMwTIgFJ9vAXi1RaAZt-JSDmctDrZWXtH5hi730TwNN8K_7SYrdq6DXqPzP7b3L9qsQq8Xml80JlHuCuC4T2NZH6TliN3pAUV-8h-CXxGiv-sxmtkoAK3kYeJ81-J5NLkOiOPAl4vYIQWbe-xcpArCfbh0DXS30X3gCa2AzYOBIRiFDQybCMuF5HlOz7MAN1VmlK-KTJ-EZSjtVQBKG6zqReDuup5zbOvmWzU4",
    source: "Greenhouse A",
    inSpace: true,
  },
  {
    id: "ZN-PRO-088",
    crop: "Zinnia",
    series: "Profusion",
    variety: "Yellow Star",
    code: "ZN-PRO-088",
    confidence: "medium",
    score: 81,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbrv3nNIhQXYMnI9QzneLH_L9s0BsAeJjNpla9r74qir9RZfKquwEfrs2qh3cP_frzIejF73zI3WE15P4ueQzLsCI5POTvubr5il5wIq92P608bal0a0qMtMJ3-i2QER30ObiLV4fpFUGeVVO1qd22vsaZvzm5VKzX8WsBP6se4fZbg_xVQPWQp3iSCcZWhvPnCUEp7wGS89HVJTBjNZ_7Me0DiBKD4zuUo1l8p5xX7Pwi1weDUPQk1-YzZgfrUTukneW29lovCls",
    source: "Greenhouse A",
    inSpace: false,
  },
];

export const processingSteps = [
  { name: "Uploading PDF", status: "complete" as const },
  { name: "Page Classification", status: "complete" as const },
  { name: "L1: PyMuPDF Extraction", status: "active" as const },
  { name: "L2: High-Res Rendering", status: "pending" as const },
  { name: "Image Post-Processing", status: "pending" as const },
  { name: "AI Naming & Scoring", status: "pending" as const },
  { name: "Deduplication Check", status: "pending" as const },
];
