import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Stats } from './pages/Stats'
import { Navbar } from './components/Layout/Navbar'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // Loading
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="text-4xl animate-pulse">🍅</span>
      </div>
    )
  }

  if (!session) return <Login />

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar email={session.user.email} />
        <main className="flex-1">
          <Routes>
            <Route path="/"      element={<Home user={session.user} />} />
            <Route path="/stats" element={<Stats user={session.user} />} />
            <Route path="*"      element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
