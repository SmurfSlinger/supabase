'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const login = async () => {
    setMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMsg(error.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Login</h1>

      <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        {msg && <p>{msg}</p>}

        <p>
          No account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  )
}