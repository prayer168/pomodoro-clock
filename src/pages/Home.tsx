import { useState, useRef, useCallback, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { TimerMode, SoundType, DEFAULT_SETTINGS } from '../types'
import { useTimer } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import { useTasks } from '../hooks/useTasks'
import { useStats } from '../hooks/useStats'
import { TimerDisplay } from '../components/Timer/TimerDisplay'
import { TaskList } from '../components/Tasks/TaskList'
import { SettingsModal } from '../components/Settings/SettingsModal'
import { ScreenLock } from '../components/ScreenLock/ScreenLock'

interface HomeProps {
  user: User
}

export function Home({ user }: HomeProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const sessionStartRef = useRef<string>(new Date().toISOString())
  const soundRef = useRef<{ sound: SoundType; volume: number }>({
    sound: DEFAULT_SETTINGS.sound,
    volume: DEFAULT_SETTINGS.volume,
  })

  const { play } = useSound()
  const { recordSession } = useStats(user.id)
  const { tasks, addTask, toggleTask, deleteTask, incrementPomodoro } = useTasks(user.id)

  const handleComplete = useCallback((mode: TimerMode) => {
    play(soundRef.current.sound, soundRef.current.volume)
    recordSession(mode, activeTaskId, sessionStartRef.current, true)
    if (mode === 'focus' && activeTaskId) {
      incrementPomodoro(activeTaskId)
    }
    sessionStartRef.current = new Date().toISOString()
  }, [activeTaskId, play, recordSession, incrementPomodoro])

  const timer = useTimer({ onComplete: handleComplete })

  useEffect(() => {
    soundRef.current = { sound: timer.settings.sound, volume: timer.settings.volume }
  }, [timer.settings.sound, timer.settings.volume])

  const handleStart = () => {
    sessionStartRef.current = new Date().toISOString()
    timer.start()
  }

  const handleLock = useCallback(() => {
    setIsLocked(true)
    document.documentElement.requestFullscreen().catch(() => {})
  }, [])

  const handleUnlock = useCallback(() => {
    setIsLocked(false)
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center gap-10 py-10 px-4 overflow-hidden">
      {/* Scan line overlay */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', animation: 'scanline 6s linear infinite' }} />

      {/* Ambient glow blob */}
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] z-0"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)' }} />

      {/* Floating data-flow text (left) */}
      <div className="pointer-events-none fixed left-4 top-0 z-0 flex flex-col gap-6 opacity-[0.06] font-mono text-[10px] text-sky-400 tracking-widest"
        style={{ animation: 'dataflow 14s linear infinite' }}>
        {['01001010','SYS::OK','T+0042','FOCUS','ACQ','SYNC','0xF4C2','READY','10110100','MODE::A'].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      {/* Floating data-flow text (right) */}
      <div className="pointer-events-none fixed right-4 top-0 z-0 flex flex-col gap-6 opacity-[0.06] font-mono text-[10px] text-sky-400 tracking-widest"
        style={{ animation: 'dataflow 18s linear infinite reverse' }}>
        {['ACORN','0xFF','TIMER','11001','PWR::ON','LOCK','0xA3B1','IDLE','SESSION','0b1010'].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      <div className="relative z-10">
        <TimerDisplay
          mode={timer.mode}
          status={timer.status}
          timeLeft={timer.timeLeft}
          totalTime={timer.totalTime}
          progress={timer.progress}
          focusCount={timer.focusCount}
          onSetMode={timer.setMode}
          onStart={handleStart}
          onPause={timer.pause}
          onReset={timer.reset}
          onSkip={timer.skip}
          onOpenSettings={() => setShowSettings(true)}
          onLock={handleLock}
        />
      </div>

      {activeTaskId && (
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 -mt-4 relative z-10">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>{tasks.find(t => t.id === activeTaskId)?.title}</span>
        </div>
      )}

      <div className="relative z-10 w-full flex justify-center">
        <TaskList
          tasks={tasks}
          activeTaskId={activeTaskId}
          onAdd={addTask}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onSelect={setActiveTaskId}
        />
      </div>

      {showSettings && (
        <SettingsModal
          settings={timer.settings}
          onSave={timer.updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {isLocked && (
        <ScreenLock
          mode={timer.mode}
          status={timer.status}
          timeLeft={timer.timeLeft}
          progress={timer.progress}
          onUnlock={handleUnlock}
        />
      )}
    </div>
  )
}
