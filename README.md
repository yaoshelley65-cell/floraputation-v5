# Floraputation V5

AI-powered flower variety catalog management platform. Upload PDF catalogs, automatically extract variety images and metadata, and build a searchable visual database.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (with custom design tokens)
- **Icons:** Material Symbols Outlined (Google Fonts)
- **Fonts:** Montserrat (headings) + Inter (body)
- **Package Manager:** pnpm
- **Deploy Target:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd floraputation-v5

# Install dependencies
pnpm install

# Approve build scripts (if prompted)
pnpm approve-builds sharp

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── page.tsx                  # Root redirect → /search
│   ├── globals.css               # Tailwind v4 theme & design tokens
│   ├── login/
│   │   └── page.tsx              # Login/Register page
│   ├── search/
│   │   └── page.tsx              # Search Varieties (card grid)
│   ├── upload/
│   │   ├── page.tsx              # PDF Upload page
│   │   └── [id]/
│   │       ├── processing/
│   │       │   └── page.tsx      # Processing Status page
│   │       ├── review/
│   │       │   └── page.tsx      # Human Validation (table view)
│   │       └── duplicates/
│   │           └── page.tsx      # Deduplication Confirmation page
│   ├── spaces/
│   │   ├── page.tsx              # Spaces list (empty state)
│   │   └── [id]/
│   │       └── page.tsx          # Space detail (variety grid)
│   └── varieties/
│       └── [id]/
│           └── edit/
│               └── page.tsx      # Edit modal (overlay)
├── components/
│   ├── layout/
│   │   ├── index.ts              # Layout exports
│   │   ├── AppShell.tsx          # Main layout wrapper
│   │   ├── TopAppBar.tsx         # Desktop/mobile top navigation
│   │   ├── SideNavBar.tsx        # Desktop sidebar (Spaces)
│   │   └── BottomNavBar.tsx      # Mobile bottom navigation
│   └── ui/                       # Reusable UI components (extensible)
└── lib/
    ├── utils.ts                  # cn() utility for class merging
    └── placeholder-data.ts       # Mock data for development
```

## Route Structure

| Route | Page | Description |
|-------|------|-------------|
| `/` | — | Redirects to `/search` |
| `/login` | Login/Register | Email + password auth with invitation code |
| `/search` | Search Varieties | Card grid with filters |
| `/upload` | PDF Upload | Drag-and-drop upload with progress |
| `/upload/[id]/processing` | Processing Status | Extraction progress timeline |
| `/upload/[id]/review` | Human Validation | Table view with batch operations |
| `/upload/[id]/duplicates` | Deduplication | Side-by-side comparison |
| `/spaces` | Spaces List | Empty state with CTAs |
| `/spaces/[id]` | Space Detail | Variety grid for a space |
| `/varieties/[id]/edit` | Edit Variety | Modal overlay for metadata editing |

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#4e635a` | Brand, buttons, active states |
| Background | `#fbf9f7` | Page background |
| Background Main | `#F9F8F4` | Content area background |
| Confidence High | `#8DA399` | High confidence indicators |
| Confidence Medium | `#E6D4A2` | Medium confidence indicators |
| Confidence Low | `#E6A2A2` | Low confidence / anomaly indicators |
| Border Muted | `#E2E4DE` | Card borders, dividers |
| Text Primary | `#1A1C1B` | Main text |
| Text Secondary | `#5C615E` | Supporting text |

### Typography

| Style | Font | Size | Weight |
|-------|------|------|--------|
| Display Large | Montserrat | 48px | 700 |
| Headline Medium | Montserrat | 24px | 600 |
| Headline Small | Montserrat | 20px | 600 |
| Body Large | Inter | 16px | 400 |
| Body Medium | Inter | 14px | 400 |
| Body Small | Inter | 13px | 400 |
| Label Bold | Inter | 12px | 700 |
| Label Muted | Inter | 11px | 400 |

### Spacing

| Token | Value |
|-------|-------|
| Gutter | 24px |
| Card Gap | 20px |
| Margin Mobile | 16px |
| Margin Desktop | 48px |
| Container Max | 1440px |

## Key Features

- **Responsive Design:** All pages adapt from mobile to desktop
- **Shared Layout:** TopAppBar, SideNavBar (desktop), BottomNavBar (mobile)
- **Confidence System:** Color-coded indicators (green/yellow/red) for AI extraction confidence
- **Batch Operations:** Table view with multi-select and batch actions
- **Drag & Drop Upload:** Interactive file upload with progress visualization
- **Deduplication UI:** Side-by-side comparison for resolving duplicates
- **Invitation Code:** Registration gated by code "SJ9597" for upload access

## Deployment

This project is configured for Vercel deployment:

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Development Notes

- All pages use placeholder data from `src/lib/placeholder-data.ts`
- No real API calls are made — ready for backend integration
- Images use external URLs from Google's CDN (configured in `next.config.ts`)
- The design tokens in `globals.css` match the Stitch HTML export exactly

## License

Private — Floraputation V5
