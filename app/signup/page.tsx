'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Signup() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    

    if (error) {
      alert(error.message)
    } else {
      alert("Signup successful")
    }

  }

  return (
    <div>
      <h1>Signup</h1>

      <input
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>
        Sign Up
      </button>

    </div>
  )
}