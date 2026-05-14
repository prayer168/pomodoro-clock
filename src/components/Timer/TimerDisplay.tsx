import { TimerMode, TimerStatus } from '../../types'
import { TimerRing } from './TimerRing'

interface TimerDisplayProps {
  mode: TimerMode
  status: TimerStatus
  timeLeft: number
  totalTime: number
  progress: number
  focusCount: number
  onSetMode: (mode: TimerMode) => void
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  onOpenSettings: () => void
  onLock: () => void
}

const modes: { key: TimerMode; label: string }[] = [
  { key: 'focus', label: '專注' },
  { key: 'short', label: '短休' },
  { key: 'long',  label: '長休' },
]

const modeTabActive: Record<TimerMode, string> = {
  focus: 'bg-red-500/20 text-red-400 border-red-500/40',
  short: 'bg-green-500/20 text-green-400 border-green-500/40',
  long:  'bg-blue-500/20 text-blue-400 border-blue-500/40',
}

export function TimerDisplay({
  mode, status, timeLeft, progress, focusCount,
  onSetMode, onStart, onPause, onReset, onSkip, onOpenSettings, onLock,
}: TimerDisplayProps) {
  const isRunning  = status === 'running'
  const isFinished = status === 'finished'

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Mode tabs */}
      <div className="flex gap-2">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSetMode(key)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
              mode === key
                ? modeTabActive[key]
                : 'text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Ring */}
      <TimerRing progress={progress} mode={mode} timeLeft={timeLeft} />

      {/* Focus count pips */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i < focusCount % 4 ? 'bg-red-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="重置"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {isRunning ? (
          <button
            onClick={onPause}
            className="w-16 h-16 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 transition-colors"
          >
            II
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={isFinished}
            className="w-16 h-16 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            ▶
          </button>
        )}

        <button
          onClick={onSkip}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="跳過"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {isFinished && (
        <p className="text-sm text-slate-400 animate-fade-in">
          {mode === 'focus' ? '時間到！去休息一下 ☕' : '休息結束，繼續加油！'}
        </p>
      )}

      <div className="flex items-center gap-4">
        {/* Lock button */}
        <button
          onClick={onLock}
          title="全螢幕鎖定"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          鎖定
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          設定
        </button>
      </div>
    </div>
  )
}
