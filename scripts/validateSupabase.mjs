/**
 * validateSupabase.mjs
 * Run: node scripts/validateSupabase.mjs
 * Validates Supabase connection by fetching from the 'profiles' table.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env manually (no dotenv dependency needed)
const envPath = resolve(__dirname, '../.env')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => line.split('=').map(s => s.trim()))
)

const url  = env['VITE_SUPABASE_URL']
const key  = env['VITE_SUPABASE_ANON_KEY']

if (!url || !key) {
  console.error('[ERROR] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key)

console.log('\n=== Validación de Conexión Supabase ===')
console.log(`URL : ${url}`)
console.log(`KEY : ${key.slice(0, 20)}...`)
console.log('----------------------------------------')

const { data, error, status } = await supabase
  .from('profiles')
  .select('id')
  .limit(1)

if (error) {
  console.error(`[FAIL] Error HTTP ${status}:`, error.message)
  console.error('Detalle:', error)
  process.exit(1)
}

console.log(`[OK] Conexión exitosa. HTTP ${status}`)
console.log(`     Tabla 'profiles' accesible. Filas devueltas: ${data.length}`)
console.log('=== Validación completada ===\n')
