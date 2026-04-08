/**
 * validateAtlas.mjs
 * Run: node scripts/validateAtlas.mjs
 *
 * Imprime la estructura jerárquica completa de La Nebulosa (island_01)
 * y valida la integridad del grafo de dependencias.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath }    from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Leer y evaluar islands.js vía texto ──────────────────────────────────
const islandsPath = resolve(__dirname, '../src/constants/islands.js')
let src = readFileSync(islandsPath, 'utf-8')
// Extraer el JSON del array ISLANDS eliminando exports y helpers
src = src
  .replace(/export\s+function[\s\S]*$/m, '')     // quitar helpers al final
  .replace(/export\s+const\s+ISLANDS\s*=/, 'const ISLANDS =')
  .replace(/export\s+/g, '')

const ISLANDS = Function(`"use strict"; ${src}; return ISLANDS;`)()

// ── Paleta visual ────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
}

const TYPE_ICON = {
  adventure: '🗺 ',
  trivia:    '❓',
  skill:     '⚙ ',
  boss:      '💀',
}

const STATUS_COLOR = {
  unlocked: C.green,
  locked:   C.dim,
  completed:C.cyan,
}

// ── Construir grafo de dependencias ──────────────────────────────────────
function buildGraph(nodes) {
  const graph = {}
  for (const n of nodes) {
    graph[n.id] = { ...n, dependents: [] }
  }
  for (const n of nodes) {
    for (const dep of n.dependencies) {
      if (graph[dep]) graph[dep].dependents.push(n.id)
    }
  }
  return graph
}

function validateGraph(graph, island) {
  const errors = []
  for (const [id, node] of Object.entries(graph)) {
    for (const dep of node.dependencies) {
      if (!graph[dep]) {
        errors.push(`  ${C.red}[ERROR]${C.reset} Nodo ${id}: dependencia '${dep}' no existe`)
      }
    }
  }
  if (errors.length === 0) {
    console.log(`  ${C.green}[OK]${C.reset} Grafo de dependencias íntegro — sin referencias rotas`)
  } else {
    errors.forEach(e => console.log(e))
  }
}

// ── Renderizado del árbol ─────────────────────────────────────────────────
function printIsland(island) {
  const line = '═'.repeat(60)
  console.log(`\n${C.yellow}${C.bold}╔${line}╗${C.reset}`)
  console.log(`${C.yellow}${C.bold}  🏝  ${island.name.toUpperCase()} (${island.era})${C.reset}`)
  console.log(`${C.yellow}${C.bold}╚${line}╝${C.reset}`)
  console.log(`  ${C.dim}ID: ${island.id}  |  Canvas: (${island.canvasX}, ${island.canvasY})  |  Locked: ${island.locked}${C.reset}`)
  console.log(`  ${C.dim}${island.description}${C.reset}\n`)

  const graph = buildGraph(island.nodes)

  // Agrupar por "nivel" topológico (BFS)
  const roots = island.nodes.filter(n => n.dependencies.length === 0)
  const visited = new Set()
  const levels = []

  let current = roots
  while (current.length > 0) {
    levels.push(current)
    current.forEach(n => visited.add(n.id))
    current = island.nodes.filter(n =>
      !visited.has(n.id) &&
      n.dependencies.every(dep => visited.has(dep))
    )
  }

  // Imprimir por niveles
  for (const [lvlIdx, level] of levels.entries()) {
    const indent = '  '.repeat(lvlIdx)
    const connector = lvlIdx === 0 ? '┌─' : '├─'

    for (const node of level) {
      const icon   = TYPE_ICON[node.type] ?? '  '
      const sColor = STATUS_COLOR[node.status] ?? ''
      const deps   = node.dependencies.length
        ? `${C.dim}← deps: [${node.dependencies.join(', ')}]${C.reset}`
        : `${C.green}${C.dim}(inicio)${C.reset}`

      const unlocks = graph[node.id].dependents.length
        ? `${C.blue}→ desbloquea: [${graph[node.id].dependents.join(', ')}]${C.reset}`
        : ''

      const rewards = node.rewards
        ? `${C.magenta}+${node.rewards.xp}xp +${node.rewards.gold}g${node.rewards.unlocks ? ` 🔓${node.rewards.unlocks}` : ''}${C.reset}`
        : ''

      console.log(
        `  ${indent}${connector} ${icon} ${C.bold}${sColor}${node.name}${C.reset}` +
        `  ${C.dim}[${node.type}]${C.reset}` +
        `  ${sColor}${node.status}${C.reset}` +
        `  ${rewards}`
      )
      console.log(
        `  ${indent}   ${C.dim}ID: ${node.id}  |  pos(${node.positionRelative.x}, ${node.positionRelative.y})${C.reset}`
      )
      console.log(`  ${indent}   ${deps}  ${unlocks}`)
      console.log()
    }

    if (lvlIdx < levels.length - 1) {
      console.log('  ' + '  '.repeat(lvlIdx) + '│')
    }
  }

  // Validación
  console.log(`  ${'─'.repeat(55)}`)
  validateGraph(graph, island)
  console.log(`  ${C.dim}Total nodos: ${island.nodes.length}  |  Tipos: ${[...new Set(island.nodes.map(n=>n.type))].join(', ')}${C.reset}`)
}

// ── MAIN ──────────────────────────────────────────────────────────────────
const nebulosa = ISLANDS.find(i => i.id === 'island_01')
if (!nebulosa) {
  console.error(`${C.red}[ERROR] island_01 no encontrada en ISLANDS${C.reset}`)
  process.exit(1)
}

console.log(`\n${C.bold}${C.cyan}╔═══════════════════════════════════════════╗${C.reset}`)
console.log(`${C.bold}${C.cyan}   ATLAS DEL TIEMPO — Validación de Nodos${C.reset}`)
console.log(`${C.bold}${C.cyan}╚═══════════════════════════════════════════╝${C.reset}`)

printIsland(nebulosa)

// Bonus: resumen de todas las islas
console.log(`\n${C.bold}══ RESUMEN DEL ATLAS ═══════════════════════════════${C.reset}`)
for (const island of ISLANDS) {
  const lock = island.locked ? `${C.red}🔒 LOCKED${C.reset}` : `${C.green}🔓 OPEN${C.reset}`
  console.log(`  ${lock}  ${C.bold}${island.name}${C.reset}  (${island.era})  — ${island.nodes.length} nodos`)
}
console.log()
