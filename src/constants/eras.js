/**
 * Master data: Eons and Eras of The Time Game world.
 * Each island maps to one era. Node content references era IDs.
 */

export const EONS = [
  { id: 'hadean',     label: 'Eón Hádico',     yearStart: -4600, yearEnd: -4000 },
  { id: 'archean',    label: 'Eón Arcaico',     yearStart: -4000, yearEnd: -2500 },
  { id: 'proterozoic',label: 'Eón Proterozoico',yearStart: -2500, yearEnd: -538  },
  { id: 'phanerozoic',label: 'Eón Fanerozoico', yearStart: -538,  yearEnd: 0     },
]

export const ERAS = [
  // Phanerozoic eras (gameplay focus)
  { id: 'paleozoic',  eonId: 'phanerozoic', label: 'Era Paleozoica',  yearStart: -538, yearEnd: -252 },
  { id: 'mesozoic',   eonId: 'phanerozoic', label: 'Era Mesozoica',   yearStart: -252, yearEnd: -66  },
  { id: 'cenozoic',   eonId: 'phanerozoic', label: 'Era Cenozoica',   yearStart: -66,  yearEnd: 0    },
]
