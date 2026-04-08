/**
 * WorldMapView.jsx — El canvas del mundo. 2500×2000px con panning.
 *
 * Responsabilidades:
 *   - Viewport 1000×700 con overflow hidden
 *   - Inner world 2500×2000 desplazable por drag
 *   - Fondo estrellas + grid de coordenadas sutil
 *   - Rutas SVG entre islas
 *   - Posiciona IslandNode y Avatar en coordenadas absolutas del mundo
 *
 * Props:
 *   avatarIslandId   — isla donde está el avatar actualmente
 *   onIslandClick    — (islandId) mover avatar
 *   onIslandEnter    — (islandId) navegar a IslandViewScreen
 *   completedIslands — Set de islandIds completadas
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { ISLANDS } from '../../constants/islands.js'
import { CANVAS } from '../../constants/gameConfig.js'
import { COLORS } from '../../constants/theme.js'
import { useMapPan } from './useMapPan.js'
import IslandNode from './IslandNode.jsx'
import Avatar from './Avatar.jsx'
import { useGame } from '../../store/gameStore'

const { width: WORLD_W, height: WORLD_H, viewportWidth: VP_W, viewportHeight: VP_H } = CANVAS

// Rutas de conexión entre islas (en orden narrativo)
const ISLAND_PATHS = [
  { from: 'island_01', to: 'island_02' },
  { from: 'island_02', to: 'island_03' },
]

function getIslandById(id) {
  return ISLANDS.find(i => i.id === id)
}

export default function WorldMapView({ avatarIslandId, onIslandClick, onIslandEnter, completedIslands = [] }) {
  const { state } = useGame() // 👈 AÑADE ESTA LÍNEA
  const currentIsland = getIslandById(avatarIslandId) ?? ISLANDS[0]
  const [avatarPos, setAvatarPos] = useState({ x: currentIsland.canvasX, y: currentIsland.canvasY })
  const [isMoving, setIsMoving] = useState(false)
  const moveTimer = useRef(null)

  const { offset, isDragging, isAnimating, hasDragged, centerOn, panHandlers } = useMapPan(
    ISLANDS.find(i => i.id === 'island_01') ?? ISLANDS[0]
  )

  // Cuando cambia avatarIslandId desde afuera, animar el avatar
  useEffect(() => {
    const island = getIslandById(avatarIslandId)
    if (!island) return
    setIsMoving(true)
    setAvatarPos({ x: island.canvasX, y: island.canvasY })
    centerOn(island.canvasX, island.canvasY)
    clearTimeout(moveTimer.current)
    moveTimer.current = setTimeout(() => setIsMoving(false), 650)
    return () => clearTimeout(moveTimer.current)
  }, [avatarIslandId, centerOn])

  // Click en isla: ignorar si fue un drag
  const handleIslandSingleClick = useCallback((islandId) => {
    if (hasDragged.current) return
    onIslandClick(islandId)
  }, [onIslandClick, hasDragged])

  // Doble clic en isla O clic en avatar: entrar
  const handleEnter = useCallback((islandId) => {
    if (hasDragged.current) return
    onIslandEnter(islandId)
  }, [onIslandEnter, hasDragged])

  // Clic en el avatar (ya está en la isla)
  const handleAvatarClick = useCallback(() => {
    if (hasDragged.current) return
    onIslandEnter(avatarIslandId)
  }, [onIslandEnter, avatarIslandId, hasDragged])

  // ── Rutas SVG ─────────────────────────────────────────────────────────
  function renderPaths() {
    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: WORLD_W,
          height: WORLD_H,
          pointerEvents: 'none',
          zIndex: 5,
          overflow: 'visible',
        }}
      >
        {ISLAND_PATHS.map(({ from, to }) => {
          const a = getIslandById(from)
          const b = getIslandById(to)
          if (!a || !b) return null
          const locked = b.locked
          // Curva de Bezier suave entre islas
          const mx = (a.canvasX + b.canvasX) / 2
          const my = Math.min(a.canvasY, b.canvasY) - 80
          return (
            <path
              key={`${from}-${to}`}
              d={`M ${a.canvasX} ${a.canvasY} Q ${mx} ${my} ${b.canvasX} ${b.canvasY}`}
              fill="none"
              stroke={locked ? COLORS.border : COLORS.accent}
              strokeWidth={locked ? 1.5 : 2.5}
              strokeDasharray={locked ? '8 6' : '12 5'}
              opacity={locked ? 0.35 : 0.65}
            />
          )
        })}
      </svg>
    )
  }

  return (
    <div
      style={{
        width: VP_W,
        height: VP_H,
        overflow: 'hidden',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        borderRadius: 8,
        boxShadow: '0 0 0 2px rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.7)',
      }}
      {...panHandlers}
    >
      {/* ── World canvas (2500×2000) ──────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: isAnimating ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          willChange: 'transform',
          // Fondo: cielo nocturno profundo + grid de coordenadas sutil
          background: `
            radial-gradient(ellipse 60% 50% at 30% 40%, rgba(14,30,60,0.9) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 70%, rgba(8,20,45,0.8) 0%, transparent 65%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 99px,
              rgba(255,255,255,0.025) 99px,
              rgba(255,255,255,0.025) 100px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 99px,
              rgba(255,255,255,0.025) 99px,
              rgba(255,255,255,0.025) 100px
            ),
            #060b26
          `,
        }}
      >
        {/* Estrellas decorativas (puntos fijos en el canvas) */}
        <Stars />

        {/* Rutas entre islas */}
        {renderPaths()}

        {/* Islas */}
        {ISLANDS.map(island => {
          // 👈 CONEXIÓN REAL: Verificamos si el jugador ya desbloqueó esta isla
          const isUnlocked = state.unlockedIslands.includes(island.id);

          return (
            <IslandNode
              key={island.id}
              // Sobrescribimos el 'locked' estático del archivo islands.js
              island={{ ...island, locked: !isUnlocked }}
              isAvatarHere={island.id === avatarIslandId}
              isCompleted={completedIslands.includes(island.id)}
              onSingleClick={handleIslandSingleClick}
              onDoubleClick={handleEnter}
            />
          )
        })}

        {/* Avatar del Cronista */}
        <Avatar
          worldX={avatarPos.x}
          worldY={avatarPos.y}
          isMoving={isMoving}
          onClick={handleAvatarClick}
        />
      </div>

      {/* Tooltip de ayuda cuando no hay drag activo */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        right: 14,
        fontSize: 10,
        color: 'rgba(255,255,255,0.25)',
        pointerEvents: 'none',
        letterSpacing: 0.5,
      }}>
        ARRASTRAR para explorar · DOBLE CLIC para entrar
      </div>
    </div>
  )
}

// ── Estrellas estáticas como decoración ───────────────────────────────────
const STAR_DATA = Array.from({ length: 120 }, (_, i) => {
  // Pseudo-aleatorio determinista por índice
  const seed = (i * 2654435761) >>> 0
  const seed2 = (seed * 2246822519) >>> 0
  return {
    x: (seed % WORLD_W),
    y: (seed2 % WORLD_H),
    r: ((seed % 3) === 0) ? 2 : 1,
    op: 0.2 + (seed % 60) / 100,
  }
})

function Stars() {
  return (
    <svg
      style={{
        position: 'absolute', top: 0, left: 0,
        width: WORLD_W, height: WORLD_H,
        pointerEvents: 'none', zIndex: 1,
      }}
    >
      {STAR_DATA.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op} />
      ))}
    </svg>
  )
}
