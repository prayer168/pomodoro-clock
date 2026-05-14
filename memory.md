# 蕃茄鐘 App 建立過程紀錄

## 專案概述

一個全端蕃茄鐘 Web App，支援登入、任務清單、歷史統計，部署於 Vercel。

**線上網址：** https://pomodoro-clock-rm1at4znp-prayer168s-projects.vercel.app

---

## 技術決策過程

### 討論細節（建立前）

| 項目 | 選擇 | 原因 |
|------|------|------|
| 平台 | Web App | 跨裝置，不需安裝 |
| UI 風格 | 圓形進度環 | SVG 動畫，視覺直觀 |
| 技術堆疊 | React + TypeScript + Vite | 現代前端主流，型別安全 |
| 後端 | Supabase (BaaS) | PostgreSQL + Auth 一鍵完成，不需寫後端程式 |
| 認證 | Email + Google OAuth | 彈性，支援多種登入方式 |
| 圖表 | Recharts | React 生態系最成熟的圖表庫 |
| 資料儲存 | 後端 API + 資料庫 | 跨裝置同步，資料不遺失 |
| 聲音 | 內建多種音效 | Web Audio API 合成，無需外部音檔 |
| 模式切換 | 手動按開始 | 使用者自主控制節奏 |

---

## 系統架構

```
clock/
├── src/
│   ├── types/index.ts          # 共用型別 (TimerMode, Task, SoundType...)
│   ├── lib/supabase.ts         # Supabase client 初始化
│   ├── hooks/
│   │   ├── useTimer.ts         # 計時器核心邏輯（狀態機）
│   │   ├── useSound.ts         # Web Audio API 音效合成
│   │   ├── useTasks.ts         # 任務 CRUD（Supabase）
│   │   └── useStats.ts         # 統計查詢與 session 記錄
│   ├── components/
│   │   ├── Timer/
│   │   │   ├── TimerRing.tsx   # SVG 圓形進度環
│   │   │   └── TimerDisplay.tsx # 計時器主控制列
│   │   ├── Tasks/TaskList.tsx  # 任務清單 UI
│   │   ├── Layout/Navbar.tsx   # 頂部導覽列
│   │   └── Settings/SettingsModal.tsx  # 設定彈窗
│   ├── pages/
│   │   ├── Login.tsx           # 登入/註冊頁
│   │   ├── Home.tsx            # 主頁（計時器 + 任務）
│   │   └── Stats.tsx           # 統計頁（Recharts 圖表）
│   ├── App.tsx                 # Auth guard + Router
│   └── main.tsx
├── supabase/migrations/
│   └── 001_init.sql            # DB schema + RLS policies
└── CLAUDE.md                   # AI 開發指引
```

---

## 資料庫 Schema

```sql
-- 任務表
create table public.tasks (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  title                text not null,
  completed            boolean not null default false,
  pomodoros_completed  integer not null default 0,
  created_at           timestamptz not null default now()
);

-- 蕃茄鐘 session 記錄表
create table public.pomodoro_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  task_id     uuid references public.tasks(id) on delete set null,
  type        text not null check (type in ('focus', 'short', 'long')),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  completed   boolean not null default false
);
```

兩張表均啟用 **Row Level Security（RLS）**，使用者只能存取自己的資料。

---

## 功能說明

### 計時器（useTimer.ts）
- 狀態機：`idle → running → paused → running → finished`
- 自動判斷下次休息類型：每 N 個專注後進入長休（N 可設定，預設 4）
- 支援跳過（skip）

### 音效系統（useSound.ts）
- 全程使用 **Web Audio API** 合成，無需外部音檔
- 4 種音效：禪鐘（bell）、音階（chime）、數位（digital）、柔和（soft）
- AudioContext 延遲建立（避免瀏覽器自動播放限制）

### 進度環（TimerRing.tsx）
- SVG 圓形，使用 `stroke-dashoffset` 控制進度
- 三種模式色系：專注紅 `#ef4444`、短休綠 `#22c55e`、長休藍 `#3b82f6`

### 統計圖表（Stats.tsx）
- 查詢近 14 天已完成的專注 session
- Recharts BarChart，填補無資料的日期為 0

---

## 建立步驟紀錄

### Step 1：初始化專案
```bash
# 建立所有設定檔（手動，不用 create-vite）
# package.json, vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js
```

### Step 2：Supabase 設定
1. 建立專案 `pomodoro-clock`（東京節點）
2. SQL Editor 執行 `supabase/migrations/001_init.sql`
3. 取得 Project URL 與 Publishable Key

### Step 3：本機開發
```bash
# 建立 .env.local
VITE_SUPABASE_URL=https://yydcqheksmdsgniwgnds.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...

npm install
npm run dev   # http://localhost:5173
```

### Step 4：修正 TypeScript 錯誤
部署時發現兩個 TS 錯誤：

| 錯誤 | 原因 | 修正方式 |
|------|------|---------|
| `'isIdle' is declared but never read` | 宣告了未使用的變數 | 刪除 `isIdle` 宣告 |
| `Property 'env' does not exist on type 'ImportMeta'` | 缺少 Vite 型別定義 | 新增 `src/vite-env.d.ts` |
| `timer` 使用前宣告問題 | `handleComplete` 內使用 `timer` 但 `timer` 在後面才宣告 | 改用 `soundRef` (useRef) 解耦循環依賴 |

### Step 5：部署到 Vercel
```bash
git init
git add .
git commit -m "init: pomodoro clock app"
git remote add origin https://github.com/prayer168/pomodoro-clock.git
git push -u origin main
```
Vercel 連接 GitHub repo → 自動偵測 Vite → 設定環境變數 → Deploy

---

## 環境變數（Vercel）

| 變數名稱 | 用途 |
|----------|------|
| `VITE_SUPABASE_URL` | Supabase 專案 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Publishable Key（前端安全使用） |

---

## 常用指令

```bash
npm run dev       # 本機開發伺服器
npm run build     # 型別檢查 + 打包
npm run typecheck # 只做型別檢查
npm run lint      # ESLint（零警告政策）
```

---

## 已知限制與後續可擴充

- [ ] Google OAuth 尚未設定（需 Google Cloud Console）
- [ ] 統計頁目前只顯示近 14 天，可擴充為月/年
- [ ] 設定尚未持久化到資料庫（重整後會重置）
- [ ] 無離線支援（PWA）
- [ ] 無桌面通知（Notification API）
