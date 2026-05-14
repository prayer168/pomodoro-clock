# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server at http://localhost:5173
npm run build        # tsc type-check + vite production build
npm run typecheck    # type-check only (no emit)
npm run lint         # ESLint (zero warnings policy)
npm run preview      # preview production build locally
```

## Environment

Copy `.env.example` to `.env.local` and fill in Supabase credentials:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

**Tech stack:** React 18 + TypeScript + Vite, Tailwind CSS v3, Supabase (Auth + PostgreSQL), Recharts.

**Auth flow** (`App.tsx`): `supabase.auth.getSession()` + `onAuthStateChange` drive a `Session | null | undefined` state. `undefined` = loading spinner; `null` = show `<Login>`; `Session` = render main app inside `<BrowserRouter>`.

**Timer logic** (`src/hooks/useTimer.ts`): All countdown state lives here. `status` transitions: `idle → running → paused → running → finished`. On finish, calls `onComplete(mode)` which triggers sound + records the Supabase session. The hook also tracks `focusCount` to determine whether the next break should be short or long (based on `settings.longBreakInterval`).

**Sound system** (`src/hooks/useSound.ts`): Four sounds (bell, chime, digital, soft) synthesised entirely via Web Audio API — no audio files. `AudioContext` is created lazily and reused.

**Data layer**: Two Supabase tables with RLS (users only access their own rows):
- `tasks` — CRUD via `useTasks.ts`
- `pomodoro_sessions` — insert-only via `useStats.ts`; stats queries aggregate the last 14 days of completed focus sessions.

**Pages:**
- `/` → `Home.tsx` — timer + task list side by side; active task is wired to pomodoro increment on completion
- `/stats` → `Stats.tsx` — 14-day bar chart (Recharts) + summary cards

**Supabase migration:** `supabase/migrations/001_init.sql` — run this once in the Supabase SQL editor or via `supabase db push`.

## Mode colours

| Mode  | Tailwind / Hex    |
|-------|-------------------|
| focus | red-500 `#ef4444` |
| short | green-500 `#22c55e` |
| long  | blue-500 `#3b82f6` |

These are referenced in `TimerRing.tsx` (SVG stroke) and `TimerDisplay.tsx` (tab highlights).
