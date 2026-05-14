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

const MODE_COLOR: Record<TimerMode, string> = {
  focus: '#38bdf8',
  short: '#34d399',
  long:  '#a78bfa',
}

const MODE_LABEL: Record<TimerMode, string> = {
  focus: 'FOCUS',
  short: 'SHORT BREAK',
  long:  'LONG BREAK',
}

const MODE_GLOW: Record<TimerMode, string> = {
  focus: 'glow-focus',
  short: 'glow-short',
  long:  'glow-long',
}

const modes: { key: TimerMode; label: string }[] = [
  { key: 'focus', label: 'FOCUS' },
  { key: 'short', label: 'SHORT' },
  { key: 'long',  label: 'LONG'  },
]

export function TimerDisplay({
  mode, status, timeLeft, totalTime, progress, focusCount,
  onSetMode, onStart, onPause, onReset, onSkip, onOpenSettings, onLock,
}: TimerDisplayProps) {
  const isRunning  = status === 'running'
  const isFinished = status === 'finished'
  const color = MODE_COLOR[mode]

  // Remaining minutes label
  const minsLeft = Math.ceil(timeLeft / 60)
  const totalMins = Math.round(totalTime / 60)

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs relative px-2 py-6">
      {/* HUD corner brackets */}
      <div className="hud-corner hud-tl" style={{ borderColor: `${color}40` }} />
      <div className="hud-corner hud-tr" style={{ borderColor: `${color}40` }} />
      <div className="hud-corner hud-bl" style={{ borderColor: `${color}40` }} />
      <div className="hud-corner hud-br" style={{ borderColor: `${color}40` }} />

      {/* Mode selector */}
      <div className="flex gap-1.5">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSetMode(key)}
            className={`px-3 py-1 text-xs font-mono tracking-widest border rounded transition-all ${
              mode === key
                ? `border-current ${MODE_GLOW[key]}`
                : 'border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-400'
            }`}
            style={mode === key ? { color, borderColor: `${color}80` } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <TimerRing progress={progress} mode={mode} timeLeft={timeLeft} size={290} />

      {/* Status readout */}
      <div className="flex items-center gap-4 text-xs font-mono tracking-widest">
        <span style={{ color: `${color}80` }}>{MODE_LABEL[mode]}</span>
        <span className="text-slate-700">|</span>
        <span className="text-slate-500">{minsLeft}/{totalMins} MIN</span>
      </div>

      {/* Session pips */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i < focusCount % 4 ? color : '#0f2040',
              boxShadow: i < focusCount % 4 ? `0 0 6px ${color}80` : 'none',
            }}
          />
        ))}
        <span className="text-xs font-mono text-slate-600 ml-1">
          SESSION {focusCount % 4 + 1}/4
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset */}
        <button onClick={onReset}
          className="p-2.5 border rounded text-xs transition-all"
          style={{ borderColor: `${color}25`, color: `${color}60` }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}60`; (e.currentTarget as HTMLElement).style.color = color }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}25`; (e.currentTarget as HTMLElement).style.color = `${color}60` }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Start / Pause */}
        {isRunning ? (
          <button onClick={onPause}
            className="px-8 py-3 font-mono text-sm tracking-[0.2em] border rounded transition-all"
            style={{
              color, borderColor: `${color}70`,
              background: `${color}12`,
              boxShadow: `0 0 20px ${color}25`,
            }}>
            PAUSE
          </button>
        ) : (
          <button onClick={onStart} disabled={isFinished}
            className="px-8 py-3 font-mono text-sm tracking-[0.2em] border rounded transition-all disabled:opacity-30"
            style={{
              color, borderColor: `${color}70`,
              background: `${color}12`,
              boxShadow: `0 0 20px ${color}25`,
            }}>
            {isFinished ? 'DONE' : 'START'}
          </button>
        )}

        {/* Skip */}
        <button onClick={onSkip}
          className="p-2.5 border rounded text-xs transition-all"
          style={{ borderColor: `${color}25`, color: `${color}60` }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}60`; (e.currentTarget as HTMLElement).style.color = color }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}25`; (e.currentTarget as HTMLElement).style.color = `${color}60` }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Finished message */}
      {isFinished && (
        <p className="text-xs font-mono tracking-widest animate-fade-in" style={{ color: `${color}99` }}>
          {mode === 'focus' ? '// SESSION COMPLETE' : '// BREAK COMPLETE'}
        </p>
      )}

      {/* Bottom controls */}
      <div className="flex items-center gap-5 mt-1">
        <button onClick={onLock}
          className="flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-600 hover:text-slate-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          LOCK
        </button>
        <button onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-600 hover:text-slate-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          CONFIG
        </button>
      </div>
    </div>
  )
}
