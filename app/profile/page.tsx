'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  updated_at: string | null
}

export default function ProfilePage() {

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileRow | null>(null)

  const [fullName, setFullName] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      setMsg('')

      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id,email,full_name,avatar_url,updated_at')
        .eq('id', userData.user.id)
        .single()

      if (error) {
        setMsg(error.message)
        setLoading(false)
        return
      }

      setProfile(data as ProfileRow)
      setFullName(data.full_name ?? '')
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const save = async () => {
    setMsg('')

    if (!profile) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id)

    if (error) {
      setMsg(error.message)
      return
    }

    setMsg('Saved!')
  }

  if (loading) {
    return <main style={{ padding: 16 }}>Loading...</main>
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Profile</h1>

      {msg && <p>{msg}</p>}

      {profile && (
        <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
          <div>
            <div><b>Email:</b></div>
            <div>{profile.email ?? '(no email)'}</div>
          </div>

          <label>
            <div><b>Full name</b></div>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
            />
          </label>

          <button onClick={save}>Save</button>
        </div>
      )}
    </main>
  )
}