import { useMemo } from 'react'
import { TimerMode } from '../../types'

interface TimerRingProps {
  progress: number
  mode: TimerMode
  timeLeft: number
  size?: number
}

const MODE_COLOR: Record<TimerMode, string> = {
  focus: '#38bdf8',
  short: '#34d399',
  long:  '#a78bfa',
}

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export function TimerRing({ progress, mode, timeLeft, size = 290 }: TimerRingProps) {
  const cx = size / 2
  const cy = size / 2
  const color = MODE_COLOR[mode]

  // Layer radii
  const outerTickR = size * 0.475
  const dashRingR  = size * 0.455
  const mainR      = size * 0.415
  const innerR     = size * 0.355

  const circumference = 2 * Math.PI * mainR
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)))

  // Glowing tip position (0° = top, clockwise)
  const tipAngle = progress * 2 * Math.PI - Math.PI / 2
  const tipX = cx + mainR * Math.cos(tipAngle)
  const tipY = cy + mainR * Math.sin(tipAngle)

  // 60 tick marks
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * 2 * Math.PI - Math.PI / 2
    const major = i % 5 === 0
    const r1 = outerTickR - (major ? 7 : 3.5)
    return {
      x1: cx + r1 * Math.cos(a),       y1: cy + r1 * Math.sin(a),
      x2: cx + outerTickR * Math.cos(a), y2: cy + outerTickR * Math.sin(a),
      major,
    }
  }), [cx, cy, outerTickR])

  const glowId = `glow-${mode}`

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0" style={{ overflow: 'visible' }}>
        <defs>
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="tip-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Outer tick marks ── */}
        {ticks.map((t, i) => (
          <line key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.major ? `${color}55` : `${color}1a`}
            strokeWidth={t.major ? 1.5 : 0.8}
          />
        ))}

        {/* ── Slowly rotating dashed ring ── */}
        <circle cx={cx} cy={cy} r={dashRingR}
          stroke={`${color}22`} strokeWidth={1}
          strokeDasharray="4 10" fill="none"
          style={{ animation: 'ringRotate 30s linear infinite', transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* ── Progress track ── */}
        <circle cx={cx} cy={cy} r={mainR}
          stroke="#040e1c" strokeWidth={16} fill="none"
        />

        {/* ── Main progress arc ── */}
        <circle cx={cx} cy={cy} r={mainR}
          stroke={color} strokeWidth={14} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#${glowId})`}
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'stroke-dashoffset 0.85s linear, stroke 0.4s ease',
          }}
        />

        {/* ── Inner dashed decoration ── */}
        <circle cx={cx} cy={cy} r={innerR}
          stroke={`${color}18`} strokeWidth={1}
          strokeDasharray="2 8" fill="none"
        />

        {/* ── Glowing tip dot ── */}
        {progress > 0.01 && (
          <>
            <circle cx={tipX} cy={tipY} r={13} fill={color} opacity={0.08} />
            <circle cx={tipX} cy={tipY} r={7}  fill={color} opacity={0.3}  filter="url(#tip-glow)" />
            <circle cx={tipX} cy={tipY} r={4}  fill="white" opacity={0.95} />
          </>
        )}
      </svg>

      {/* ── Centre time label ── */}
      <div className="absolute flex flex-col items-center select-none pointer-events-none">
        <span
          className="font-mono text-white"
          style={{ fontSize: '3.4rem', fontWeight: 100, letterSpacing: '0.08em', textShadow: `0 0 20px ${color}60` }}
        >
          {fmt(timeLeft)}
        </span>
      </div>
    </div>
  )
}
