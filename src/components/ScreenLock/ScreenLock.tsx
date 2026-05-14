import { useState, useEffect, useCallback, useRef } from 'react'
import { TimerMode, TimerStatus } from '../../types'

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

const shimmerClass: Record<TimerMode, string> = {
  focus: 'shimmer-text shimmer-focus',
  short: 'shimmer-text shimmer-short',
  long:  'shimmer-text shimmer-long',
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function ScreenLock({ mode, status, timeLeft, onUnlock }: ScreenLockProps) {
  const [typed, setTyped]       = useState('')
  const [shake, setShake]       = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [wrongFlash, setWrongFlash] = useState(false)
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isRunning = status === 'running'

  const resetHintTimer = () => {
    setShowHint(false)
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    hintTimerRef.current = setTimeout(() => setShowHint(true), 4000)
  }

  useEffect(() => {
    hintTimerRef.current = setTimeout(() => setShowHint(true), 4000)
    return () => { if (hintTimerRef.current) clearTimeout(hintTimerRef.current) }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.stopPropagation()
    const key = e.key.toLowerCase()
    if (key.length !== 1 || !/[a-z]/.test(key)) return

    resetHintTimer()

    setTyped(prev => {
      const next = prev + key
      if (next === PASSWORD) { onUnlock(); return '' }
      if (PASSWORD.startsWith(next)) return next

      setWrongFlash(true)
      setShake(true)
      setTimeout(() => { setShake(false); setWrongFlash(false) }, 450)
      return ''
    })
  }, [onUnlock]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown])

  // Re-enter fullscreen if user pressed Escape
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
      }
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center gap-6 select-none cursor-none overflow-hidden"
      onClick={e => e.stopPropagation()}
      onMouseMove={e => e.stopPropagation()}
    >
      {/* Large mode label with flowing light */}
      <div
        className={`font-bold leading-none tracking-tight ${shimmerClass[mode]}`}
        style={{ fontSize: '160pt' }}
      >
        {modeLabel[mode]}
      </div>

      {/* Time — same size, shimmer */}
      <div
        className={`font-mono font-bold leading-none ${shimmerClass[mode]}`}
        style={{ fontSize: '160pt' }}
      >
        {formatTime(timeLeft)}
        {isRunning && (
          <span className="inline-block w-3 h-3 rounded-full bg-current animate-pulse align-middle ml-2" />
        )}
      </div>

      {/* Lock + password dots */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <svg
          className={`w-6 h-6 transition-colors duration-150 ${wrongFlash ? 'text-red-500' : 'text-slate-700'}`}
          fill="currentColor" viewBox="0 0 24 24"
        >
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>

        <div className={`flex gap-2.5 ${shake ? 'animate-shake' : ''}`}>
          {Array.from({ length: PASSWORD.length }).map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
                i < typed.length ? 'bg-white scale-110' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <p className={`text-xs text-slate-600 transition-opacity duration-700 ${showHint ? 'opacity-100' : 'opacity-0'}`}>
          輸入密碼解鎖
        </p>
      </div>
    </div>
  )
}
