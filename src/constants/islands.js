/**
 * islands.js — Atlas de Islas con lógica de caminos estilo "Mario 3".
 */

const HUMAN_THEMES = ['Hitos', 'Cultura', 'Ciencia', 'Sociedad', 'Deportes', 'Geografía'];

/**
 * Genera 15 nodos: 
 * - Espina dorsal obligatoria (Nivel I)
 * - Ramas opcionales de alta dificultad (Nivel II)
 * - Bazar a mitad de camino y Apuestas antes del Castillo.
 */
function generate15Nodes(islandPrefix, eraId) {
  const nodes = [];
  HUMAN_THEMES.forEach((theme, index) => {
    const baseX = -380 + (index * 105); // 👈 Compactado para que quepa el castillo

    // NIVEL 1: ESPINA DORSAL (Obligatorio)
    const currentEasyId = `${islandPrefix}_t${index}_1`;
    const prevEasyNode = index === 0 ? null : `${islandPrefix}_t${index - 1}_1`;

    nodes.push({
      id: currentEasyId,
      name: `${theme} I`,
      theme: theme,
      type: 'trivia',
      positionRelative: { x: baseX, y: 50 },
      dependencies: index === 0 ? [] : [prevEasyNode], // Solo depende del anterior fácil
      rewards: { xp: 30, gold: 15 }
    });

    // NIVEL 2: RAMA OPCIONAL (Difícil)
    // No bloquea el camino principal. Da premios únicos.
    nodes.push({
      id: `${islandPrefix}_t${index}_2`,
      name: `${theme} II`,
      theme: theme,
      type: 'trivia',
      positionRelative: { x: baseX, y: -70 },
      dependencies: [currentEasyId], // Solo depende de su versión fácil
      rewards: { xp: 120, gold: 80, special: 'libro_rescatado' }
    });
  });

  // Nodos finales
  nodes.push({
    id: `${islandPrefix}_bet`,
    name: 'APUESTAS',
    type: 'adventure',
    positionRelative: { x: 320, y: 0 },
    dependencies: [`${islandPrefix}_t5_1`],
    rewards: { xp: 10, gold: 0 }
  });

  nodes.push({
    id: `${islandPrefix}_boss`,
    name: 'EL CASTILLO',
    type: 'boss',
    positionRelative: { x: 450, y: 0 }, // 👈 Ahora entra en los 1000px del visor
    dependencies: [`${islandPrefix}_bet`],
    rewards: { xp: 500, gold: 200 }
  });

  return nodes;
}

export const ISLANDS = [
  { id: 'island_01', name: 'Época Contemporánea', eraId: 'contemporanea', locked: false, canvasX: 400, canvasY: 400, nodes: generate15Nodes('n01', 'contemporanea') },
  { id: 'island_02', name: 'Edad Antigua', eraId: 'antigua', locked: true, canvasX: 1000, canvasY: 800, nodes: generate15Nodes('n02', 'antigua') },
  { id: 'island_03', name: 'Edad Media', eraId: 'media', locked: true, canvasX: 1600, canvasY: 400, nodes: generate15Nodes('n03', 'media') },
  { id: 'island_04', name: 'Prehistoria Humana', eraId: 'prehistoria_h', locked: true, canvasX: 2000, canvasY: 1200, nodes: generate15Nodes('n04', 'prehistoria_h') },
  { id: 'island_05', name: 'Edad Moderna', eraId: 'moderna', locked: true, canvasX: 600, canvasY: 1500, nodes: generate15Nodes('n05', 'moderna') },
  { id: 'island_06', name: 'Archipiélago Geológico', eraId: 'geologica', locked: false, canvasX: 1500, canvasY: 1500, nodes: generate15Nodes('n06', 'geologica') }
];

// ── HELPERS EXPORTADOS (Críticos para gameStore.jsx) ──────────────────────

export function getIslandById(id) {
  return ISLANDS.find(i => i.id === id) || null;
}

export function getNodeById(nodeId) {
  for (const island of ISLANDS) {
    const node = island.nodes.find(n => n.id === nodeId);
    if (node) return { node, island };
  }
  return null;
}

export function getUnlockableNodes(completedNodeIds = []) {
  const result = [];
  ISLANDS.forEach(island => {
    island.nodes.forEach(node => {
      // Si ya está completado, lo ignoramos
      if (completedNodeIds.includes(node.id)) return;

      // Verificamos si todas sus dependencias están completadas
      const depsMet = node.dependencies.every(depId => completedNodeIds.includes(depId));
      if (depsMet) {
        result.push({ islandId: island.id, nodeId: node.id });
      }
    });
  });
  return result;
}