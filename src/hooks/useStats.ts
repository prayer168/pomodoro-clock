import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { DailyStat } from '../types'

export function useStats(userId: string | undefined) {
  const [stats, setStats] = useState<DailyStat[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    // Last 14 days of completed focus sessions
    const since = new Date()
    since.setDate(since.getDate() - 13)
    since.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('pomodoro_sessions')
      .select('started_at')
      .eq('user_id', userId)
      .eq('type', 'focus')
      .eq('completed', true)
      .gte('started_at', since.toISOString())

    if (data) {
      const counts: Record<string, number> = {}
      data.forEach(({ started_at }) => {
        const day = started_at.slice(0, 10)
        counts[day] = (counts[day] ?? 0) + 1
      })

      // Build a full 14-day array (fill missing days with 0)
      const result: DailyStat[] = []
      for (let i = 13; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const date = d.toISOString().slice(0, 10)
        result.push({ date, count: counts[date] ?? 0 })
      }
      setStats(result)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const recordSession = useCallback(async (
    type: 'focus' | 'short' | 'long',
    taskId: string | null,
    startedAt: string,
    completed: boolean,
  ) => {
    if (!userId) return
    await supabase.from('pomodoro_sessions').insert({
      user_id: userId,
      type,
      task_id: taskId,
      started_at: startedAt,
      ended_at: new Date().toISOString(),
      completed,
    })
    if (completed && type === 'focus') fetch()
  }, [userId, fetch])

  return { stats, loading, recordSession }
}
