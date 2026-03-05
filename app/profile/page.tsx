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

  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)

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
      setAvatarUrl(data.avatar_url ?? '')
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

  const uploadAvatar = async (file: File) => {
  setMsg('')
  setUploading(true)

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    setMsg('Not logged in')
    setUploading(false)
    return
  }

  const ext = file.name.split('.').pop() ?? 'png'
  const filePath = `${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    setMsg(uploadError.message)
    setUploading(false)
    return
  }

  const { data: publicData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const publicUrl = publicData.publicUrl

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) {
    setMsg(updateError.message)
    setUploading(false)
    return
  }

  setAvatarUrl(publicUrl)
  setMsg('Avatar updated!')
  setUploading(false)
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

          <div>
  <div><b>Avatar</b></div>

  {avatarUrl ? (
    <img
      src={avatarUrl}
      alt="avatar"
      style={{ width: 96, height: 96, borderRadius: 8, objectFit: 'cover' }}
    />
  ) : (
    <div style={{ fontStyle: 'italic' }}>(no avatar)</div>
  )}

        <input
  type="file"
  accept="image/*"
  disabled={uploading}
  onChange={(e) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    uploadAvatar(file)
    input.value = ''
  }}
/>
        </div>

          <button onClick={save}>Save</button>
        </div>
      )}
    </main>
  )
  
}