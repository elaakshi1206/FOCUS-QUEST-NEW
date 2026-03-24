# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **FocusQuest** gamified micro-learning SPA and an Express API server.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion + canvas-confetti
- **Charts**: Recharts
- **State**: React Context + localStorage (client-side only, no backend)
- **API framework**: Express 5 (api-server, unused by FocusQuest)

## FocusQuest App (`artifacts/focusquest`)

Gamified micro-learning adventure SPA for grades 1-10.

### Features
- **Three visual themes**: Ocean Pirate (grades 1-4), Space Explorer (grades 5-7), Futuristic Mind Lab (grades 8-10)
- **14 unlockable pirate character avatars** (real JPEG images in `public/characters/`)
- **XP/leveling system** — earn XP by completing quests
- **Educational quests** with Video → Notes → Quiz flow
- **Animated mascots** (🦜 Captain Beak / 🤖 AstroBot / 🧠 Cortex.AI)
- **Analytics dashboard** with Recharts line/pie charts
- **World map** with subject islands, connecting paths, floating decorations
- **5 subjects**: Mathematics, Science, English, Social Studies, Logical Thinking
- **14 quests** across all subjects with multi-choice quiz questions + hints

### Architecture
- All state in `src/lib/store.tsx` (React Context + localStorage)
- Educational content in `src/lib/data.ts` (QUESTS, SUBJECTS, CHARACTERS)
- Pages: Landing, Setup (3-step onboarding), Map, QuestList, QuestView, Results, Rewards, Customize, Analytics
- Components: AnimatedBackground, TopHUD, Mascot, ThemeWrapper
- CSS animations: waves, bubbles, stars, cyber-grid, scan-line, data-particles, shimmer, map-node-pulse

### Character image paths
Pattern: `public/characters/WhatsApp_Image_2026-03-24_at_14.08.XX_TIMESTAMP.jpeg`
In code: `${import.meta.env.BASE_URL}${char.imagePath.replace(/^\//, '')}`

### Theme system
- `ocean` (default) = grades 1-4 = blue/cyan palette
- `space` = grades 5-7 = indigo/purple/dark
- `future` = grades 8-10 = cyan/dark/cyber

## Packages

### `artifacts/api-server` (`@workspace/api-server`)
Express 5 API server (not used by FocusQuest). Routes at `/api`.

### `artifacts/focusquest` (`@workspace/focusquest`)
Main app. `pnpm --filter @workspace/focusquest run dev`

### `lib/db` (`@workspace/db`)
Drizzle ORM + PostgreSQL (used by api-server only).

## Structure

```text
artifacts/
├── api-server/         # Express API server
└── focusquest/         # FocusQuest React+Vite SPA
    ├── public/
    │   └── characters/ # 14 pirate character JPEGs
    └── src/
        ├── lib/
        │   ├── store.tsx   # Game state (Context + localStorage)
        │   └── data.ts     # QUESTS, SUBJECTS, CHARACTERS data
        ├── pages/          # Landing, Setup, Map, QuestList, QuestView, Results, Rewards, Customize, Analytics
        └── components/     # AnimatedBackground, TopHUD, Mascot, ThemeWrapper
```
