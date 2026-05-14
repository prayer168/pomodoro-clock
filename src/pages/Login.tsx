import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { AcornIcon } from '../components/Icons/AcornIcon'

export function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState<'login' | 'signup'>('login')
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState<{ text: string; error?: boolean } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage({ text: error.message, error: true })
    } else if (mode === 'signup') {
      setMessage({ text: '確認信已送出，請至信箱驗證後再登入。' })
    }
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }

  return (
    <div className="min-h-screen bg-space bg-grid flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl border border-sky-500/30 bg-sky-500/5 flex items-center justify-center glow-focus">
              <AcornIcon size={28} className="text-sky-400" />
            </div>
          </div>
          <h1 className="text-xl font-mono tracking-[0.2em] text-white">橡實鐘</h1>
          <p className="text-xs text-slate-500 mt-1 font-mono tracking-widest">ACORN TIMER SYSTEM</p>
        </div>

        <div className="bg-space-card/80 border border-space-line/60 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-sm relative">
          {/* Corner brackets */}
          <div className="hud-corner hud-tl border-sky-500/30" />
          <div className="hud-corner hud-tr border-sky-500/30" />
          <div className="hud-corner hud-bl border-sky-500/30" />
          <div className="hud-corner hud-br border-sky-500/30" />

          {/* Toggle */}
          <div className="flex bg-space/60 rounded-xl p-1 border border-space-line/40">
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono tracking-widest transition-all ${
                  mode === m ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'text-slate-500'
                }`}>
                {m === 'login' ? 'SIGN IN' : 'REGISTER'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="EMAIL"
              className="bg-space/60 border border-space-line/60 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-600
                         focus:outline-none focus:border-sky-500/50 transition-colors tracking-widest" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="PASSWORD"
              className="bg-space/60 border border-space-line/60 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-600
                         focus:outline-none focus:border-sky-500/50 transition-colors tracking-widest" />
            {message && (
              <p className={`text-xs font-mono px-1 ${message.error ? 'text-red-400' : 'text-sky-400'}`}>
                {message.text}
              </p>
            )}
            <button type="submit" disabled={loading}
              className="py-2.5 border border-sky-500/50 bg-sky-500/10 text-sky-300 font-mono text-xs tracking-widest
                         hover:bg-sky-500/20 hover:border-sky-400 disabled:opacity-40 transition-all glow-focus rounded-xl">
              {loading ? '...' : mode === 'login' ? 'SIGN IN' : 'REGISTER'}
            </button>
          </form>

          <div className="flex items-center gap-3 text-slate-700 text-xs">
            <div className="flex-1 border-t border-space-line/40" />
            <span className="font-mono">OR</span>
            <div className="flex-1 border-t border-space-line/40" />
          </div>

          <button onClick={signInWithGoogle}
            className="flex items-center justify-center gap-2 py-2.5 border border-space-line/60 rounded-xl
                       text-xs font-mono text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors tracking-widest">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            CONTINUE WITH GOOGLE
          </button>
        </div>
      </div>
    </div>
  )
}
