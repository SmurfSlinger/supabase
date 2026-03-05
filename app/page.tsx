'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      setEmail(data.user?.email ?? null)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main style={{ padding: 16 }}>
      <h1>Next.js + Supabase Starter</h1>

      {loading ? (
        <p>Checking auth...</p>
      ) : email ? (
        <>
          <p>
            Logged in as <b>{email}</b>
          </p>
          <Link href="/dashboard">Go to dashboard</Link>
        </>
      ) : (
        <>
          <p>Not logged in.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign up</Link>
          </div>
        </>
      )}
    </main>
  )
}