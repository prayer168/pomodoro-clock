import { useState, useEffect, useRef, useCallback } from 'react'
import { TimerMode, TimerStatus, TimerSettings, DEFAULT_SETTINGS } from '../types'

interface UseTimerOptions {
  onComplete: (mode: TimerMode) => void
}

interface UseTimerReturn {
  mode: TimerMode
  status: TimerStatus
  timeLeft: number
  totalTime: number
  progress: number           // 0–1, fraction elapsed
  focusCount: number         // completed focus sessions this day
  settings: TimerSettings
  setMode: (mode: TimerMode) => void
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  updateSettings: (patch: Partial<TimerSettings>) => void
}

export function useTimer({ onComplete }: UseTimerOptions): UseTimerReturn {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS)
  const [mode, setModeState] = useState<TimerMode>('focus')
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.focus * 60)
  const [focusCount, setFocusCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalTime = settings[mode] * 60

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Determine next mode given current mode + focus count
  const nextMode = useCallback((current: TimerMode, count: number): TimerMode => {
    if (current !== 'focus') return 'focus'
    return (count + 1) % settings.longBreakInterval === 0 ? 'long' : 'short'
  }, [settings.longBreakInterval])

  const applyMode = useCallback((newMode: TimerMode, newSettings?: TimerSettings) => {
    const s = newSettings ?? settings
    stopInterval()
    setModeState(newMode)
    setStatus('idle')
    setTimeLeft(s[newMode] * 60)
  }, [settings]) // eslint-disable-line react-hooks/exhaustive-deps

  const setMode = useCallback((newMode: TimerMode) => {
    applyMode(newMode)
  }, [applyMode])

  const start = useCallback(() => {
    setStatus(prev => prev === 'finished' ? prev : 'running')
  }, [])

  const pause = useCallback(() => {
    setStatus(prev => prev === 'running' ? 'paused' : prev)
  }, [])

  const reset = useCallback(() => {
    applyMode(mode)
  }, [applyMode, mode])

  const skip = useCallback(() => {
    const newCount = mode === 'focus' ? focusCount + 1 : focusCount
    setFocusCount(newCount)
    applyMode(nextMode(mode, focusCount))
  }, [mode, focusCount, applyMode, nextMode])

  const updateSettings = useCallback((patch: Partial<TimerSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      // If we're idle, refresh timeLeft for the current mode
      setStatus(s => {
        if (s === 'idle') setTimeLeft(next[mode] * 60)
        return s
      })
      return next
    })
  }, [mode])

  useEffect(() => {
    if (status !== 'running') { stopInterval(); return }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopInterval()
          setStatus('finished')
          setModeState(current => {
            const newCount = current === 'focus' ? focusCount + 1 : focusCount
            if (current === 'focus') setFocusCount(newCount)
            onComplete(current)
            return current
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return stopInterval
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0

  return {
    mode, status, timeLeft, totalTime, progress, focusCount,
    settings, setMode, start, pause, reset, skip, updateSettings,
  }
}
