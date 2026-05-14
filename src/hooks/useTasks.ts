import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Task } from '../types'

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setTasks(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const addTask = useCallback(async (title: string) => {
    if (!userId || !title.trim()) return
    const { data } = await supabase
      .from('tasks')
      .insert({ user_id: userId, title: title.trim() })
      .select()
      .single()
    if (data) setTasks(prev => [data, ...prev])
  }, [userId])

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const { data } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id)
      .select()
      .single()
    if (data) setTasks(prev => prev.map(t => t.id === id ? data : t))
  }, [tasks])

  const deleteTask = useCallback(async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const incrementPomodoro = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const { data } = await supabase
      .from('tasks')
      .update({ pomodoros_completed: task.pomodoros_completed + 1 })
      .eq('id', id)
      .select()
      .single()
    if (data) setTasks(prev => prev.map(t => t.id === id ? data : t))
  }, [tasks])

  return { tasks, loading, addTask, toggleTask, deleteTask, incrementPomodoro }
}
