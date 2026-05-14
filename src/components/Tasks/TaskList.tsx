import { useState } from 'react'
import { Task } from '../../types'

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
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">任務清單</h2>

      {/* Input */}
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="新增任務..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500
                     focus:outline-none focus:border-slate-500 transition-colors"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
        >
          +
        </button>
      </form>

      {/* List */}
      <ul className="flex flex-col gap-1.5">
        {tasks.length === 0 && (
          <li className="text-sm text-slate-600 text-center py-4">還沒有任務</li>
        )}
        {tasks.map(task => (
          <li
            key={task.id}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
              activeTaskId === task.id
                ? 'bg-slate-700/60 border-slate-600'
                : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => onSelect(activeTaskId === task.id ? null : task.id)}
          >
            {/* Checkbox */}
            <button
              onClick={e => { e.stopPropagation(); onToggle(task.id) }}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-slate-600 hover:border-slate-400'
              }`}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Title */}
            <span className={`flex-1 text-sm truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {task.title}
            </span>

            {/* Pomodoro count */}
            {task.pomodoros_completed > 0 && (
              <span className="text-xs text-slate-500">🍅 {task.pomodoros_completed}</span>
            )}

            {/* Delete */}
            <button
              onClick={e => { e.stopPropagation(); onDelete(task.id) }}
              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
