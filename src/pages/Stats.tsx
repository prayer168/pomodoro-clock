import { User } from '@supabase/supabase-js'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStats } from '../hooks/useStats'

interface StatsProps {
  user: User
}

export function Stats({ user }: StatsProps) {
  const { stats, loading } = useStats(user.id)

  const totalFocus = stats.reduce((sum, d) => sum + d.count, 0)
  const todayCount = stats[stats.length - 1]?.count ?? 0
  const bestDay    = Math.max(...stats.map(d => d.count), 0)

  const chartData = stats.map(d => ({
    date: d.date.slice(5),   // MM-DD
    count: d.count,
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
      <h1 className="text-xl font-bold text-white">統計</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '今日', value: todayCount },
          { label: '14日合計', value: totalFocus },
          { label: '單日最佳', value: bestDay },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-medium text-slate-400 mb-4">近 14 天完成蕃茄數</h2>
        {loading ? (
          <div className="h-48 flex items-center justify-center text-slate-600 text-sm">載入中...</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={1}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  color: '#f1f5f9',
                  fontSize: 12,
                }}
                cursor={{ fill: '#1e293b' }}
                formatter={(v: number) => [`${v} 個蕃茄`, '']}
              />
              <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Empty state */}
      {!loading && totalFocus === 0 && (
        <p className="text-center text-slate-500 text-sm -mt-4">
          完成第一個蕃茄後就會在這裡顯示 🍅
        </p>
      )}
    </div>
  )
}
