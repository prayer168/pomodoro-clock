import { TimerMode } from '../../types'

interface TimerRingProps {
  progress: number   // 0–1 fraction elapsed
  mode: TimerMode
  timeLeft: number
  size?: number
}

const modeColor: Record<TimerMode, { stroke: string; text: string }> = {
  focus: { stroke: '#ef4444', text: 'text-red-400' },
  short: { stroke: '#22c55e', text: 'text-green-400' },
  long:  { stroke: '#3b82f6', text: 'text-blue-400' },
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function TimerRing({ progress, mode, timeLeft, size = 280 }: TimerRingProps) {
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  const { stroke } = modeColor[mode]

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={12}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.4s ease' }}
        />
      </svg>

      {/* Time label */}
      <div className="absolute flex flex-col items-center gap-1 select-none">
        <span className="text-6xl font-mono font-bold tracking-tight text-white">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  )
}
