export type TimerMode = 'focus' | 'short' | 'long'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'
export type SoundType = 'bell' | 'chime' | 'digital' | 'soft'

export interface TimerSettings {
  focus: number             // minutes
  short: number
  long: number
  longBreakInterval: number // every N focus sessions
  sound: SoundType
  volume: number            // 0–1
}

export const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25,
  short: 5,
  long: 15,
  longBreakInterval: 4,
  sound: 'bell',
  volume: 0.7,
}

export interface Task {
  id: string
  user_id: string
  title: string
  completed: boolean
  pomodoros_completed: number
  created_at: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  task_id: string | null
  type: TimerMode
  started_at: string
  ended_at: string | null
  completed: boolean
}

export interface DailyStat {
  date: string   // YYYY-MM-DD
  count: number
}
