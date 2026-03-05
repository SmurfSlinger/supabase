/* setup.js
  quick setup for local dev
  - installs deps
  - starts supabase (handles already-running / stuck containers)
  - writes/updates .env.local
  - resets db (runs migrations)
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

function tryRun(cmd) {
  try {
    run(cmd)
    return true
  } catch (e) {
    return false
  }
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

function cleanupSupabaseContainers() {
  try {
    const names = capture('docker ps -a --filter "name=supabase_" --format "{{.Names}}"')
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)

    if (!names.length) return

    console.log('\nCleaning up leftover supabase_* containers...')
    for (const n of names) {
      tryRun(`docker rm -f ${n}`)
    }
  } catch (e) {

  }
}

function readLocalUrlAndKey() {
  // Use supabase status output 
  const status = capture('supabase status')

  const urlMatch = status.match(/Project URL\s*│\s*(http:\/\/[^\s│]+)\s*│/)
  const keyMatch = status.match(/Publishable\s*│\s*([A-Za-z0-9_\-]+)\s*│/)

  if (!urlMatch || !keyMatch) {
    console.log('\nCould not parse supabase status output:')
    console.log(status)
    process.exit(1)
  }

  return {
    url: urlMatch[1].trim(),
    anonKey: keyMatch[1].trim(),
  }
}

function main() {
  const root = process.cwd()
  const envPath = path.join(root, '.env.local')

  console.log('Setting up Next.js + Supabase starter...')

  run('npm install')

  // stop is fine if it fails 
  tryRun('supabase stop')

  // start supabase 
  let started = tryRun('supabase start')
  if (!started) {
    cleanupSupabaseContainers()
    started = tryRun('supabase start')
  }

  if (!started) {
    console.log('\nSupabase failed to start.')
    console.log('Try running these manually:')
    console.log('  supabase stop')
    console.log('  docker ps -a --filter "name=supabase_"')
    console.log('  (then remove any stuck containers)')    
    process.exit(1)
  }

  const { url, anonKey } = readLocalUrlAndKey()

  upsertEnv(envPath, 'NEXT_PUBLIC_SUPABASE_URL', url)
  upsertEnv(envPath, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', anonKey)

  console.log('\n.env.local updated')

  run('supabase db reset')

  console.log('\nDone.')
  console.log('Next steps:')
  console.log('- npm run dev')
  console.log('- open http://localhost:3000')
}

main()