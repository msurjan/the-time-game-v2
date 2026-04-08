/**
 * library.js — Catálogo de Library Items (Libros del Tiempo).
 *
 * Modelo de monetización dual:
 *   price_gold  → moneda in-game (ganada jugando)
 *   price_usd   → compra directa (B2C / B2B gifting)
 *   price_usd = 0 → solo obtenible con gold (no premium)
 *
 * Raridades: common | uncommon | rare | legendary
 *
 * Buffs disponibles:
 *   extra_life      → otorga +1 vida inmediatamente al usar
 *   time_freeze     → pausa el timer de la pregunta por 10 segundos
 *   double_points   → duplica XP y gold de un nodo completo
 *   hint_reveal     → elimina 2 opciones incorrectas en trivia
 *   shield          → absorbe 1 error sin perder vida
 *   node_skip       → saltea un nodo (no boss) sin penalización
 */

export const LIBRARY_ITEMS = [
  // ── COMMON ──────────────────────────────────────────────
  {
    id:          'book_001',
    title:       'Crónicas del Trilobites',
    era:         'Paleozoico',
    eraId:       'paleozoic',
    rarity:      'common',
    description: 'Un diario de campo sobre los primeros artrópodos marinos.',
    price_gold:  50,
    price_usd:   0,
    buff:        'hint_reveal',
    coverColor:  '#4a7c59',
  },
  {
    id:          'book_002',
    title:       'El Herbario de Gondwana',
    era:         'Paleozoico',
    eraId:       'paleozoic',
    rarity:      'common',
    description: 'Registro botánico del supercontinente del sur.',
    price_gold:  50,
    price_usd:   0,
    buff:        'hint_reveal',
    coverColor:  '#5a8a3a',
  },
  {
    id:          'book_003',
    title:       'Memorias del Jurásico',
    era:         'Mesozoico',
    eraId:       'mesozoic',
    rarity:      'common',
    description: 'Anecdotario de un paleontólogo en tierras prehistóricas.',
    price_gold:  50,
    price_usd:   0,
    buff:        'hint_reveal',
    coverColor:  '#6b8f3a',
  },

  // ── UNCOMMON ────────────────────────────────────────────
  {
    id:          'book_004',
    title:       'El Códice del Pérmico',
    era:         'Paleozoico',
    eraId:       'paleozoic',
    rarity:      'uncommon',
    description: 'Tratado sobre la extinción más devastadora de la historia.',
    price_gold:  120,
    price_usd:   0.99,
    buff:        'shield',
    coverColor:  '#8b5e3c',
  },
  {
    id:          'book_005',
    title:       'Atlas de los Pterosaurios',
    era:         'Mesozoico',
    eraId:       'mesozoic',
    rarity:      'uncommon',
    description: 'Cartografía de las rutas de vuelo de los reptiles alados.',
    price_gold:  120,
    price_usd:   0.99,
    buff:        'time_freeze',
    coverColor:  '#3c6b8b',
  },
  {
    id:          'book_006',
    title:       'Diario del Pleistoceno',
    era:         'Cenozoico',
    eraId:       'cenozoic',
    rarity:      'uncommon',
    description: 'Relatos de vida durante la última era glacial.',
    price_gold:  120,
    price_usd:   0.99,
    buff:        'shield',
    coverColor:  '#4a6080',
  },

  // ── RARE ────────────────────────────────────────────────
  {
    id:          'book_007',
    title:       'El Tomo del T-Rex',
    era:         'Mesozoico',
    eraId:       'mesozoic',
    rarity:      'rare',
    description: 'Manuscrito secreto sobre el apex predador del Cretácico.',
    price_gold:  300,
    price_usd:   2.99,
    buff:        'double_points',
    coverColor:  '#8b2222',
  },
  {
    id:          'book_008',
    title:       'Crónicas del Mamut',
    era:         'Cenozoico',
    eraId:       'cenozoic',
    rarity:      'rare',
    description: 'Historia oral de las últimas manadas de mamuts lanudos.',
    price_gold:  300,
    price_usd:   2.99,
    buff:        'extra_life',
    coverColor:  '#5c4a7a',
  },
  {
    id:          'book_009',
    title:       'El Grimorio de la Pangea',
    era:         'Paleozoico',
    eraId:       'paleozoic',
    rarity:      'rare',
    description: 'Mapa sagrado de la deriva continental original.',
    price_gold:  300,
    price_usd:   2.99,
    buff:        'double_points',
    coverColor:  '#7a5c22',
  },

  // ── LEGENDARY ───────────────────────────────────────────
  {
    id:          'book_010',
    title:       'El Libro del Tiempo',
    era:         'Universal',
    eraId:       null,
    rarity:      'legendary',
    description: 'La crónica completa de la historia de la Tierra. Solo uno existe.',
    price_gold:  0,          // no se vende, se gana como recompensa de jefe final
    price_usd:   9.99,
    buff:        'node_skip',
    coverColor:  '#c8a800',
  },
  {
    id:          'book_011',
    title:       'Códex Omnisciente',
    era:         'Universal',
    eraId:       null,
    rarity:      'legendary',
    description: 'Confiere sabiduría total sobre una era completa.',
    price_gold:  0,
    price_usd:   9.99,
    buff:        'extra_life',
    coverColor:  '#c8a800',
  },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'legendary']

export function getBookById(id) {
  return LIBRARY_ITEMS.find(b => b.id === id) ?? null
}

export function getBooksByEra(eraId) {
  return LIBRARY_ITEMS.filter(b => b.eraId === eraId)
}

export function getBooksByRarity(rarity) {
  return LIBRARY_ITEMS.filter(b => b.rarity === rarity)
}
