import { useState } from 'react'
import { TimerSettings, SoundType } from '../../types'
import { useSound } from '../../hooks/useSound'

interface SettingsModalProps {
  settings: TimerSettings
  onSave: (patch: Partial<TimerSettings>) => void
  onClose: () => void
}

const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: 'bell',    label: '禪鐘' },
  { value: 'chime',   label: '音階' },
  { value: 'digital', label: '數位' },
  { value: 'soft',    label: '柔和' },
]

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [local, setLocal] = useState(settings)
  const { play } = useSound()

  const set = <K extends keyof TimerSettings>(key: K, val: TimerSettings[K]) =>
    setLocal(prev => ({ ...prev, [key]: val }))

  const save = () => { onSave(local); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">設定</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        {/* Time settings */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider">時間（分鐘）</h3>
          {([
            ['focus', '專注'],
            ['short', '短休'],
            ['long',  '長休'],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{label}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => set(key, Math.max(1, (local[key] as number) - 1))}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >−</button>
                <span className="w-8 text-center text-white font-mono">{local[key]}</span>
                <button
                  onClick={() => set(key, Math.min(99, (local[key] as number) + 1))}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >+</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">長休間隔</span>
            <div className="flex items-center gap-2">
              <button onClick={() => set('longBreakInterval', Math.max(2, local.longBreakInterval - 1))}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors">−</button>
              <span className="w-8 text-center text-white font-mono">{local.longBreakInterval}</span>
              <button onClick={() => set('longBreakInterval', Math.min(8, local.longBreakInterval + 1))}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors">+</button>
            </div>
          </div>
        </section>

        {/* Sound settings */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider">提示音</h3>
          <div className="grid grid-cols-2 gap-2">
            {SOUND_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { set('sound', value); play(value, local.volume) }}
                className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                  local.sound === value
                    ? 'bg-slate-700 border-slate-500 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">🔈</span>
            <input
              type="range"
              min={0} max={1} step={0.05}
              value={local.volume}
              onChange={e => set('volume', parseFloat(e.target.value))}
              className="flex-1 accent-slate-400"
            />
            <span className="text-sm text-slate-400">🔊</span>
          </div>
        </section>

        <button
          onClick={save}
          className="w-full py-2.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
        >
          儲存
        </button>
      </div>
    </div>
  )
}
