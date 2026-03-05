import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Starter App</h1>
      <ul>
        <li><Link href="/signup">Sign up</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </main>
  )
}
