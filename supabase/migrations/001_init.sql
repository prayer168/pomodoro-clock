-- Enable RLS on all tables

create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  completed    boolean not null default false,
  pomodoros_completed integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.tasks enable row level security;
create policy "users manage own tasks" on public.tasks
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.pomodoro_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  task_id      uuid references public.tasks(id) on delete set null,
  type         text not null check (type in ('focus', 'short', 'long')),
  started_at   timestamptz not null default now(),
  ended_at     timestamptz,
  completed    boolean not null default false
);

alter table public.pomodoro_sessions enable row level security;
create policy "users manage own sessions" on public.pomodoro_sessions
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for stats queries by date range
create index pomodoro_sessions_user_date
  on public.pomodoro_sessions (user_id, started_at desc);
