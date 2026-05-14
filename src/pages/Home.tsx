import { useState, useRef, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { TimerMode } from '../types'
import { useTimer } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import { useTasks } from '../hooks/useTasks'
import { useStats } from '../hooks/useStats'
import { TimerDisplay } from '../components/Timer/TimerDisplay'
import { TaskList } from '../components/Tasks/TaskList'
import { SettingsModal } from '../components/Settings/SettingsModal'

interface HomeProps {
  user: User
}

export function Home({ user }: HomeProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const sessionStartRef = useRef<string>(new Date().toISOString())

  const { play } = useSound()
  const { recordSession } = useStats(user.id)
  const { tasks, addTask, toggleTask, deleteTask, incrementPomodoro } = useTasks(user.id)

  const handleComplete = useCallback((mode: TimerMode) => {
    play(timer.settings.sound, timer.settings.volume)
    recordSession(mode, activeTaskId, sessionStartRef.current, true)
    if (mode === 'focus' && activeTaskId) {
      incrementPomodoro(activeTaskId)
    }
    sessionStartRef.current = new Date().toISOString()
  }, [activeTaskId]) // eslint-disable-line react-hooks/exhaustive-deps

  const timer = useTimer({ onComplete: handleComplete })

  const handleStart = () => {
    sessionStartRef.current = new Date().toISOString()
    timer.start()
  }

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
      />

      {/* Active task indicator */}
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
    </div>
  )
}
