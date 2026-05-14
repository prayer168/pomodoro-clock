import { useState } from 'react'
import { Task } from '../../types'
import { AcornIcon } from '../Icons/AcornIcon'

interface TaskListProps {
  tasks: Task[]
  activeTaskId: string | null
  onAdd: (title: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string | null) => void
}

export function TaskList({ tasks, activeTaskId, onAdd, onToggle, onDelete, onSelect }: TaskListProps) {
  const [input, setInput] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) { onAdd(input); setInput('') }
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <h2 className="text-xs font-mono tracking-[0.2em] text-slate-500">// TASK QUEUE</h2>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ADD TASK..."
          className="flex-1 bg-space-card/60 border border-space-line/50 rounded-lg px-3 py-2 text-xs font-mono
                     text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/40 transition-colors tracking-widest"
        />
        <button type="submit"
          className="px-3 py-2 bg-space-card/60 border border-space-line/50 hover:border-sky-500/40
                     rounded-lg text-slate-400 hover:text-sky-400 text-sm transition-colors">
          +
        </button>
      </form>

      <ul className="flex flex-col gap-1.5">
        {tasks.length === 0 && (
          <li className="text-xs font-mono text-slate-600 text-center py-4 tracking-widest">NO TASKS</li>
        )}
        {tasks.map(task => (
          <li
            key={task.id}
            onClick={() => onSelect(activeTaskId === task.id ? null : task.id)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
              activeTaskId === task.id
                ? 'bg-sky-500/5 border-sky-500/30'
                : 'bg-space-card/40 border-space-line/40 hover:border-space-line/70'
            }`}
          >
            <button
              onClick={e => { e.stopPropagation(); onToggle(task.id) }}
              className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                task.completed ? 'bg-sky-500/20 border-sky-500' : 'border-slate-600 hover:border-sky-500/50'
              }`}
            >
              {task.completed && (
                <svg className="w-2.5 h-2.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <span className={`flex-1 text-xs font-mono truncate ${task.completed ? 'line-through text-slate-600' : 'text-slate-300'}`}>
              {task.title}
            </span>

            {task.pomodoros_completed > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-slate-500">
                <AcornIcon size={11} className="text-sky-500/60" />
                <span className="font-mono">{task.pomodoros_completed}</span>
              </span>
            )}

            <button
              onClick={e => { e.stopPropagation(); onDelete(task.id) }}
              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
