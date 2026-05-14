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
    <div className="flex flex-col items-center gap-10 py-10 px-4">
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

      {activeTaskId && (
        <div className="flex items-center gap-2 text-sm text-slate-400 -mt-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{tasks.find(t => t.id === activeTaskId)?.title}</span>
        </div>
      )}

      <TaskList
        tasks={tasks}
        activeTaskId={activeTaskId}
        onAdd={addTask}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onSelect={setActiveTaskId}
      />

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
