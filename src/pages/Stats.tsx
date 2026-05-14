import { User } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useStats } from '../hooks/useStats'
import { AcornIcon } from '../components/Icons/AcornIcon'

interface StatsProps { user: User }

export function Stats({ user }: StatsProps) {
  const { stats, loading } = useStats(user.id)

  const totalFocus = stats.reduce((sum, d) => sum + d.count, 0)
  const todayCount = stats[stats.length - 1]?.count ?? 0
  const bestDay    = Math.max(...stats.map(d => d.count), 0)

  const chartData = stats.map(d => ({ date: d.date.slice(5), count: d.count }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
      <h1 className="text-xs font-mono tracking-[0.25em] text-slate-400">// STATS OVERVIEW</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TODAY', value: todayCount },
          { label: '14-DAY TOTAL', value: totalFocus },
          { label: 'BEST DAY', value: bestDay },
        ].map(({ label, value }) => (
          <div key={label} className="bg-space-card/60 border border-space-line/50 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="hud-corner hud-tl border-sky-500/20" />
            <div className="hud-corner hud-br border-sky-500/20" />
            <span className="text-3xl font-mono font-light text-white text-glow-focus">{value}</span>
            <span className="text-xs font-mono tracking-widest text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-space-card/60 border border-space-line/50 rounded-xl p-5 relative">
        <div className="hud-corner hud-tl border-sky-500/20" />
        <div className="hud-corner hud-tr border-sky-500/20" />
        <div className="hud-corner hud-bl border-sky-500/20" />
        <div className="hud-corner hud-br border-sky-500/20" />
        <h2 className="text-xs font-mono tracking-[0.2em] text-slate-500 mb-5">SESSIONS / 14 DAYS</h2>
        {loading ? (
          <div className="h-48 flex items-center justify-center text-slate-600 text-xs font-mono tracking-widest">LOADING...</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f2040" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#334155', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} interval={1} />
              <YAxis allowDecimals={false} tick={{ fill: '#334155', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#050f1f', border: '1px solid #0f2040', borderRadius: 8, color: '#e2e8f0', fontSize: 11, fontFamily: 'monospace' }}
                cursor={{ fill: '#0f2040' }}
                formatter={(v: number) => [`${v} sessions`, '']}
              />
              <Bar dataKey="count" fill="#38bdf8" radius={[3, 3, 0, 0]} maxBarSize={24} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {!loading && totalFocus === 0 && (
        <div className="flex flex-col items-center gap-2 text-slate-600 -mt-4">
          <AcornIcon size={24} className="text-slate-700" />
          <p className="text-xs font-mono tracking-widest">COMPLETE FIRST SESSION TO VIEW STATS</p>
        </div>
      )}
    </div>
  )
}
