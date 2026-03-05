'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {

  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
        return
      }

      setEmail(data.user.email ?? '')
    }

    load()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Dashboard</h1>

      <p>Logged in as: {email || '(no email)'}</p>

      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/profile">Profile</Link>
        <button onClick={logout}>Sign out</button>
      </div>
    </main>
  )
}