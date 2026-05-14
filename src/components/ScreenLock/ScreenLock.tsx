import { useState, useEffect, useCallback, useRef } from 'react'
import { TimerMode, TimerStatus } from '../../types'
import { TimerRing } from '../Timer/TimerRing'

interface ScreenLockProps {
  mode: TimerMode
  status: TimerStatus
  timeLeft: number
  progress: number
  onUnlock: () => void
}

const PASSWORD = 'rainpray'

const modeLabel: Record<TimerMode, string> = {
  focus: '專注中',
  short: '短休中',
  long:  '長休中',
}

export function ScreenLock({ mode, status, timeLeft, progress, onUnlock }: ScreenLockProps) {
  const [typed, setTyped]     = useState('')
  const [shake, setShake]     = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [wrongFlash, setWrongFlash] = useState(false)
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show hint text after 4 s of inactivity
  useEffect(() => {
    hintTimerRef.current = setTimeout(() => setShowHint(true), 4000)
    return () => { if (hintTimerRef.current) clearTimeout(hintTimerRef.current) }
  }, [])

  const resetHintTimer = () => {
    setShowHint(false)
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    hintTimerRef.current = setTimeout(() => setShowHint(true), 4000)
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Block all keys from reaching anything else
    e.stopPropagation()
    // Don't call preventDefault on Escape — browser forces fullscreen exit,
    // but our overlay will still be visible and require the password.

    const key = e.key.toLowerCase()
    if (key.length !== 1 || !/[a-z]/.test(key)) return

    resetHintTimer()

    setTyped(prev => {
      const next = prev + key

      if (next === PASSWORD) {
        onUnlock()
        return ''
      }

      if (PASSWORD.startsWith(next)) return next

      // Wrong input — shake and reset
      setWrongFlash(true)
      setShake(true)
      setTimeout(() => { setShake(false); setWrongFlash(false) }, 450)
      return ''
    })
  }, [onUnlock]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // capture: true — intercept before any other handler
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown])

  // Try to re-enter fullscreen if user escaped it while still locked
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
      }
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const isRunning = status === 'running'

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center select-none cursor-none"
      onClick={e => e.stopPropagation()}
      onMouseMove={e => e.stopPropagation()}
    >
      {/* Mode badge */}
      <div className={`text-xs font-semibold uppercase tracking-[0.2em] mb-8 ${
        mode === 'focus' ? 'text-red-500'
        : mode === 'short' ? 'text-green-500'
        : 'text-blue-500'
      }`}>
        {modeLabel[mode]}
        {isRunning && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />}
      </div>

      {/* Timer ring */}
      <TimerRing progress={progress} mode={mode} timeLeft={timeLeft} size={300} />

      {/* Lock section */}
      <div className="mt-12 flex flex-col items-center gap-4">
        {/* Lock icon */}
        <svg
          className={`w-7 h-7 transition-colors ${wrongFlash ? 'text-red-500' : 'text-slate-600'}`}
          fill="currentColor" viewBox="0 0 24 24"
        >
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>

        {/* Password dots */}
        <div className={`flex gap-2.5 ${shake ? 'animate-shake' : ''}`}>
          {Array.from({ length: PASSWORD.length }).map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
                i < typed.length
                  ? 'bg-white scale-110'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Hint */}
        <p className={`text-xs text-slate-600 transition-opacity duration-700 ${showHint ? 'opacity-100' : 'opacity-0'}`}>
          輸入密碼解鎖
        </p>
      </div>
    </div>
  )
}
