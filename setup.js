/* setup.js
  quick setup for local dev
  installs deps,
  starts supabase,
  writes/updates .env.local,
  and resets db (runs migrations)
*/

const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

function run(cmd) {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

function capture(cmd) {
  return execSync(cmd, { encoding: 'utf8' })
}

function upsertEnv(envPath, key, value) {
  let content = ''
  if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, 'utf8')

  const line = `${key}=${value}`
  const regex = new RegExp(`^${key}=.*$`, 'm')

  if (regex.test(content)) {
    content = content.replace(regex, line)
  } else {
    if (content.length && !content.endsWith('\n')) content += '\n'
    content += line + '\n'
  }

  fs.writeFileSync(envPath, content, 'utf8')
}

function main() {
  const root = process.cwd()
  const envPath = path.join(root, '.env.local')

  console.log('Setting up Next.js + Supabase starter...')

  run('npm install')

  // start supabase 
  run('supabase start')

  // grab URL + publishable key from status
  const status = capture('supabase status')
  const urlMatch = status.match(/Project URL\s*\|\s*(http:\/\/[^\s]+)/)
  const keyMatch = status.match(/Publishable\s*\|\s*([A-Za-z0-9_\-]+)/)

  if (!urlMatch || !keyMatch) {
    console.log('\nCould not parse supabase status output:')
    console.log(status)
    process.exit(1)
  }

  const url = urlMatch[1].trim()
  const publishableKey = keyMatch[1].trim()

  upsertEnv(envPath, 'NEXT_PUBLIC_SUPABASE_URL', url)
  upsertEnv(envPath, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', publishableKey)

  console.log('\n.env.local updated')

  // rebuild db from migrations
  run('supabase db reset')

  console.log('\nDone.')
  console.log('Next steps:')
  console.log('- npm run dev')
  console.log('- open http://localhost:3000')
}

main()