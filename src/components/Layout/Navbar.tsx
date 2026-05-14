import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface NavbarProps {
  email: string | undefined
}

export function Navbar({ email }: NavbarProps) {
  const { pathname } = useLocation()

  const signOut = () => supabase.auth.signOut()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <div className="flex items-center gap-2 font-semibold text-white">
        <span className="text-xl">🍅</span>
        <span>蕃茄鐘</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className={`text-sm transition-colors ${
            pathname === '/' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          計時器
        </Link>
        <Link
          to="/stats"
          className={`text-sm transition-colors ${
            pathname === '/stats' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          統計
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 hidden sm:block">{email}</span>
        <button
          onClick={signOut}
          className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          登出
        </button>
      </div>
    </nav>
  )
}
