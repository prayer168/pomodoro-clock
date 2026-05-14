import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AcornIcon } from '../Icons/AcornIcon'

interface NavbarProps {
  email: string | undefined
}

export function Navbar({ email }: NavbarProps) {
  const { pathname } = useLocation()

  const signOut = () => supabase.auth.signOut()

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-space-line/60 bg-space-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-slate-300">
        <AcornIcon size={18} className="text-sky-400" />
        <span className="text-sky-400/80">橡實鐘</span>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/" className={`text-xs font-mono tracking-widest transition-colors ${pathname === '/' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
          TIMER
        </Link>
        <Link to="/stats" className={`text-xs font-mono tracking-widest transition-colors ${pathname === '/stats' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
          STATS
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 hidden sm:block font-mono">{email}</span>
        <button
          onClick={signOut}
          className="text-xs font-mono tracking-widest text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-600 px-3 py-1.5 rounded transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    </nav>
  )
}
