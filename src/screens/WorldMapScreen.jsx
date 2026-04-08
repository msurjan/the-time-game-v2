import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../store/gameStore.jsx'
import { ISLANDS } from '../constants/islands.js'
import { CANVAS } from '../constants/gameConfig.js'
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../constants/theme.js'
import WorldMapView from '../components/world/WorldMapView.jsx'
import SkillRadar from '../components/world/SkillRadar.jsx'

const { viewportWidth: VP_W, viewportHeight: VP_H } = CANVAS

/**
 * deriveLevel — Calcula el nivel del Cronista basado en XP.
 */
function deriveLevel(xp) {
  const safeXp = Number(xp) || 0;
  return Math.floor(safeXp / 100) + 1;
}

/**
 * WorldMapScreen — El centro de mando del Cronista.
 * Muestra el progreso global, el radar RPG y el acceso a las islas.
 */
export default function WorldMapScreen() {
  const { state } = useGame()
  const navigate = useNavigate()

  // Isla donde se encuentra el cursor/avatar actualmente
  const [avatarIslandId, setAvatarIslandId] = useState('island_01')

  // 1. CÁLCULO DE MAESTRÍA (%)
  // Se recalcula solo cuando cambias de isla o completas un nodo.
  const islandStats = useMemo(() => {
    const currentIsland = ISLANDS.find(i => i.id === avatarIslandId);
    if (!currentIsland) return { percentage: 0, completed: 0, total: 0 };

    const totalNodes = currentIsland.nodes.length;
    const completedInIsland = currentIsland.nodes.filter(node =>
      state.completedNodes.includes(node.id)
    ).length;

    return {
      percentage: Math.round((completedInIsland / totalNodes) * 100),
      completed: completedInIsland,
      total: totalNodes
    };
  }, [avatarIslandId, state.completedNodes]);

  // 2. FILTRO DE ISLAS COMPLETADAS
  const completedIslands = ISLANDS
    .filter(island =>
      island.nodes.length > 0 &&
      island.nodes.every(n => state.completedNodes.includes(n.id))
    )
    .map(i => i.id)

  const handleIslandClick = useCallback((islandId) => {
    setAvatarIslandId(islandId)
  }, [])

  const handleIslandEnter = useCallback((islandId) => {
    navigate(`/island/${islandId}`)
  }, [navigate])

  const level = deriveLevel(state.xp)

  return (
    <div style={{
      width: '100vw', height: '100vh', background: COLORS.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: SPACING.md, position: 'relative', overflow: 'hidden'
    }}>

      {/* ── HUD SUPERIOR ── */}
      <div style={{
        width: VP_W, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${SPACING.sm}px ${SPACING.md}px`, background: 'rgba(12, 14, 30, 0.95)',
        border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.lg }}>
          <HudStat icon="💰" label="Oro" value={state.gold} color={COLORS.accent} />
          <HudStat icon="❤️" label="Vidas" value={state.lives} color="#e53935" />
          <HudStat icon="⭐" label="Nivel" value={`Lv. ${level}`} color="#7eb8f7" />
          <HudStat icon="📊" label="Maestría" value={`${islandStats.percentage}%`} color={COLORS.accent} />
        </div>

        {/* Radar RPG en tiempo real */}
        <div style={{ transform: 'scale(0.8)', marginRight: -10 }}>
          <SkillRadar skills={state.skills} />
        </div>

        {/* Info de la Era Seleccionada */}
        <div style={{ fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, textAlign: 'right', minWidth: 150 }}>
          {(() => {
            const island = ISLANDS.find(i => i.id === avatarIslandId)
            return island
              ? <><span style={{ color: COLORS.textPrimary, fontWeight: 'bold', fontSize: '1rem' }}>{island.name}</span><br />{island.eraId}</>
              : null
          })()}
        </div>
      </div>

      {/* ── VISOR DEL MAPA (CANVAS) ── */}
      <WorldMapView
        avatarIslandId={avatarIslandId}
        onIslandClick={handleIslandClick}
        onIslandEnter={handleIslandEnter}
        completedIslands={completedIslands}
      />

      {/* ── BARRA DE PROGRESO DE LA ISLA ── */}
      <div style={{ width: VP_W, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 6, letterSpacing: '1px' }}>
          REGISTROS RECUPERADOS: {islandStats.completed} / {islandStats.total}
        </div>
        <div style={{
          width: '100%', height: 8, background: 'rgba(255,255,255,0.05)',
          borderRadius: RADIUS.full, overflow: 'hidden', border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{
            width: `${islandStats.percentage}%`, height: '100%',
            background: `linear-gradient(90deg, ${COLORS.accent}, #c084fc)`,
            borderRadius: RADIUS.full, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
      </div>

    </div>
  )
}

/**
 * HudStat — Pequeño componente para los indicadores del HUD.
 */
function HudStat({ icon, label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 'bold', color, lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  )
}