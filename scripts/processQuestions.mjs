/**
 * processQuestions.mjs
 * Run: node scripts/processQuestions.mjs
 *
 * Normaliza los eventos de raw_questions.js (formato LEVEL_0_EVENTS:
 * { name, year, era, emoji, summary, theme }) y genera preguntas
 * de trivia con distractores automáticos, asignadas a los nodos
 * correctos según la era de cada evento.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── 1. Cargar raw_questions.js (ESM sin importar el módulo) ───────────────
const rawPath = resolve(__dirname, '../src/constants/raw_questions.js')
// Strip all `export` keywords so the source is valid inside Function()
const rawSrc = readFileSync(rawPath, 'utf-8')
  .replace(/^export\s+/gm, '')

const RAW_QUESTIONS_LEGACY = Function(`"use strict"; ${rawSrc}; return RAW_QUESTIONS_LEGACY;`)()

console.log(`\n[INFO] Eventos cargados: ${RAW_QUESTIONS_LEGACY.length}`)

// ── 2. Mapa de era → islandEraId ─────────────────────────────────────────
const ERA_TO_ERAID = {
  'Hadeico': 'paleozoic',
  'Arcaico': 'paleozoic',
  'Paleozoico': 'paleozoic',
  'Mesozoico': 'mesozoic',
  'Cenozoico': 'cenozoic',
  'Prehistoria': 'paleozoic',
  'Edad Antigua': 'paleozoic',  // sin isla propia aún → isla 1
  'Edad Media': 'mesozoic',   // sin isla propia aún → isla 2
  'Edad Moderna': 'cenozoic',   // sin isla propia aún → isla 3
  'Época Contemporánea': 'cenozoic',
}

// Nodos trivia por era (no-boss), en orden easy→hard
const ERA_TRIVIA_NODES = {
  paleozoic: ['n01_02', 'n01_04', 'n01_05'],
  mesozoic: ['n02_02', 'n02_04', 'n02_05'],
  cenozoic: ['n03_02', 'n03_04', 'n03_05'],
}

// ── 3. Derivar dificultad por antigüedad ─────────────────────────────────
function getDifficulty(year) {
  if (year === undefined || year === null) return 'easy'
  if (year < -100_000_000) return 'hard'
  if (year < -10_000) return 'medium'
  return 'easy'
}

// ── 4. Formatear año legible ──────────────────────────────────────────────
function formatYear(year) {
  if (year === undefined || year === null) return 'fecha desconocida'
  // Años d.C. (positivos): mostrar el año directamente
  if (year > 0) return `el año ${year} d.C.`
  // Años a.C. / prehistóricos (negativos): escalar a unidad legible
  const abs = Math.abs(year)
  if (abs >= 1_000_000_000) return `hace ${(abs / 1_000_000_000).toFixed(1)} mil millones de años`
  if (abs >= 1_000_000) return `hace ${(abs / 1_000_000).toFixed(0)} millones de años`
  if (abs >= 100_000) return `hace ${(abs / 1_000).toFixed(0)} mil años`
  if (abs >= 1_000) return `hace ${(abs / 1_000).toFixed(1)} mil años`
  return `en el año ${abs} a.C.`
}

// ── 5. Generar distractores (3 eventos distintos del mismo pool) ──────────
function pickDistractors(correctName, pool, count = 3) {
  const candidates = pool
    .map(e => e.name ?? e.question)
    .filter(n => n && n !== correctName)

  // mezcla determinista basada en nombre
  const seed = correctName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const shuffled = candidates
    .map((v, i) => ({ v, sort: (seed * (i + 1)) % candidates.length }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.v)

  return shuffled.slice(0, count)
}

// ── 6. Construir pregunta de trivia desde un evento ───────────────────────
/**
 * Genera 2 variantes de pregunta para mayor variedad:
 *   tipo A — "¿Qué evento ocurrió [año formateado]?"  opciones: nombres de eventos
 *   tipo B — "¿Qué describe mejor a '[name]'?"        opciones: summaries (si existen)
 * Devuelve la que sea más informativa.
 */
function buildQuestion(event, pool, idx) {
  const name = event.name ?? event.question ?? `Evento ${idx}`
  const year = event.year
  const summary = event.summary ?? null
  const emoji = event.emoji ?? ''

  // Distractores de nombres de otros eventos
  const nameDistractors = pickDistractors(name, pool, 3)

  // Si no hay suficientes distractores, fallback genérico
  while (nameDistractors.length < 3) {
    nameDistractors.push(`Evento desconocido #${nameDistractors.length + 1}`)
  }

  // Colocar respuesta correcta en posición aleatoria (0-3) determinista
  const seed = name.length % 4
  const options = [...nameDistractors]
  options.splice(seed, 0, name)     // insertar en posición `seed`
  options.splice(4)                 // asegurar exactamente 4 opciones

  const questionText = year !== undefined
    ? `¿Qué evento histórico ocurrió ${formatYear(year)}?`
    : `¿Cuál es el nombre correcto de este hito? ${emoji} "${(summary ?? name).slice(0, 80)}"`

  return {
    id: `q_${idx.toString().padStart(3, '0')}`,
    question: questionText,
    options,
    answer: seed,               // índice de la opción correcta
    name,                           // original para debug
    difficulty: getDifficulty(year),
    eraId: ERA_TO_ERAID[event.era] ?? 'paleozoic',
    era: event.era ?? 'Desconocida',
    theme: event.theme ?? event.topic ?? 'General',
    year: year ?? null,
  }
}

// ── 7. Clasificar preguntas en nodos ─────────────────────────────────────
const DIFFICULTY_NODE_IDX = { easy: 0, medium: 1, hard: 2 }

const assignment = {}

for (const [idx, raw] of RAW_QUESTIONS_LEGACY.entries()) {
  const q = buildQuestion(raw, RAW_QUESTIONS_LEGACY, idx)
  const nodeList = ERA_TRIVIA_NODES[q.eraId]
  const diffIdx = DIFFICULTY_NODE_IDX[q.difficulty] ?? 0
  const nodeId = nodeList[Math.min(diffIdx, nodeList.length - 1)]

  if (!assignment[nodeId]) assignment[nodeId] = []
  assignment[nodeId].push(q)
}

// ── 8. Reporte en terminal ────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
  red: '\x1b[31m', magenta: '\x1b[35m',
}

console.log(`\n${C.bold}${C.cyan}=== Resultado del procesamiento de preguntas ===${C.reset}\n`)

let totalAssigned = 0
for (const [nodeId, qs] of Object.entries(assignment)) {
  console.log(`  ${C.yellow}${C.bold}Nodo ${nodeId}${C.reset}  (${qs.length} preguntas)`)
  for (const q of qs) {
    const qText = (q.question ?? '').slice(0, 65)
    const correct = q.options?.[q.answer] ?? '—'
    console.log(`    ${C.dim}[${q.difficulty}]${C.reset} ${qText}...`)
    console.log(`    ${C.green}✓${C.reset} ${correct}`)
  }
  console.log()
  totalAssigned += qs.length
}

const skipped = RAW_QUESTIONS_LEGACY.length - totalAssigned
console.log(`  ${C.bold}Total procesadas : ${totalAssigned} / ${RAW_QUESTIONS_LEGACY.length}${C.reset}`)
if (skipped > 0) {
  console.log(`  ${C.red}Sin asignar     : ${skipped}${C.reset}`)
}

// ── 9. Generar src/constants/questions.js ────────────────────────────────
const outPath = resolve(__dirname, '../src/constants/questions.js')
const outContent = `/**
 * questions.js — Banco de preguntas procesado y clasificado por nodo.
 * AUTO-GENERADO por scripts/processQuestions.mjs — no editar manualmente.
 * Para regenerar: node scripts/processQuestions.mjs
 *
 * Fuente original: ${RAW_QUESTIONS_LEGACY.length} eventos de raw_questions.js
 * Generado: ${new Date().toISOString()}
 */

export const QUESTIONS_BY_NODE = ${JSON.stringify(assignment, null, 2)}

/**
 * Retorna preguntas para un nodo, mezcladas y limitadas a \`count\`.
 * Seed opcional para resultados reproducibles (ej: userId).
 */
export function getQuestionsForNode(nodeId, count = 5, seed = Date.now()) {
  const pool = QUESTIONS_BY_NODE[nodeId] ?? []
  if (pool.length === 0) return []
  if (pool.length <= count) return pool

  // Mezcla seeded (Fisher-Yates con seed simple)
  const arr = [...pool]
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}

/** Estadísticas del banco de preguntas */
export const QUESTION_STATS = {
  totalEvents:  ${RAW_QUESTIONS_LEGACY.length},
  totalNodes:   ${Object.keys(assignment).length},
  byNode: ${JSON.stringify(
  Object.fromEntries(Object.entries(assignment).map(([k, v]) => [k, v.length])),
  null, 2
)},
}
`

writeFileSync(outPath, outContent)
console.log(`\n${C.green}[OK]${C.reset} Generado: ${C.bold}src/constants/questions.js${C.reset}`)
console.log(`     Nodos cubiertos: ${Object.keys(assignment).join(', ')}\n`)
