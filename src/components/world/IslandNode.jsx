/**
 * IslandNode.jsx — Dot de isla sobre el mapa mundial. Estilo Mario 3.
 *
 * Props:
 *   island         — objeto de ISLANDS (con canvasX, canvasY, locked, name, era)
 *   isAvatarHere   — true si el avatar está posicionado en esta isla
 *   isCompleted    — true si todos los nodos fueron completados
 *   onSingleClick  — mover el avatar aquí (si desbloqueada)
 *   onDoubleClick  — entrar a la isla (si avatar ya está aquí)
 */

import { COLORS, FONT_SIZE } from '../../constants/theme.js'

const ISLAND_EMOJI = {
  island_01: '🌊',
  island_02: '🦖',
  island_03: '❄️',
}

export default function IslandNode({ island, isAvatarHere, isCompleted, onSingleClick, onDoubleClick }) {
  const { id, name, era, locked, canvasX, canvasY } = island

  const isOpen      = !locked
  const ringColor   = isCompleted ? COLORS.success : isOpen ? COLORS.accent : COLORS.border
  const glowOpacity = isOpen && !isCompleted ? 1 : 0

  function handleClick(e) {
    e.stopPropagation()
    if (!isOpen) return
    onSingleClick(id)
  }

  function handleDoubleClick(e) {
    e.stopPropagation()
    if (!isOpen) return
    onDoubleClick(id)
  }

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        position:   'absolute',
        left:       canvasX,
        top:        canvasY,
        transform:  'translate(-50%, -50%)',
        cursor:     isOpen ? 'pointer' : 'not-allowed',
        userSelect: 'none',
        zIndex:     10,
      }}
    >
      {/* Halo de selección cuando el avatar está aquí */}
      {isAvatarHere && (
        <div style={{
          position:     'absolute',
          inset:        -14,
          borderRadius: '50%',
          border:       `2px dashed ${COLORS.accent}`,
          opacity:      0.7,
          animation:    'islandGlow 2s ease-in-out infinite',
          pointerEvents:'none',
        }} />
      )}

      {/* Círculo principal */}
      <div style={{
        width:          80,
        height:         80,
        borderRadius:   '50%',
        background:     isCompleted
          ? 'radial-gradient(circle at 40% 35%, #2a5a2a, #0d1f0d)'
          : locked
            ? 'radial-gradient(circle at 40% 35%, #1a1a2e, #0d0d14)'
            : 'radial-gradient(circle at 40% 35%, #1e3a5a, #0a1828)',
        border:         `3px solid ${ringColor}`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       34,
        animation:      glowOpacity ? 'islandGlow 2.8s ease-in-out infinite' : 'none',
        boxShadow:      locked
          ? 'none'
          : `0 0 20px 4px rgba(245,166,35,0.25), inset 0 1px 0 rgba(255,255,255,0.08)`,
        transition:     'transform 0.15s, box-shadow 0.2s',
      }}>
        {locked ? '🔒' : (ISLAND_EMOJI[id] ?? '🏝')}
      </div>

      {/* Nombre */}
      <div style={{
        position:     'absolute',
        top:          '100%',
        left:         '50%',
        transform:    'translateX(-50%)',
        marginTop:    10,
        whiteSpace:   'nowrap',
        color:        locked ? COLORS.textSecondary : COLORS.textPrimary,
        fontSize:     FONT_SIZE.sm,
        fontWeight:   'bold',
        textShadow:   '0 2px 6px rgba(0,0,0,0.9)',
        pointerEvents:'none',
      }}>
        {name}
      </div>

      {/* Era */}
      <div style={{
        position:     'absolute',
        top:          'calc(100% + 26px)',
        left:         '50%',
        transform:    'translateX(-50%)',
        whiteSpace:   'nowrap',
        color:        COLORS.textSecondary,
        fontSize:     FONT_SIZE.xs,
        textShadow:   '0 1px 4px rgba(0,0,0,0.9)',
        pointerEvents:'none',
      }}>
        {era}
      </div>

      {/* Badge de completado */}
      {isCompleted && (
        <div style={{
          position:     'absolute',
          top:          -6,
          right:        -6,
          width:        22,
          height:       22,
          borderRadius: '50%',
          background:   COLORS.success,
          display:      'flex',
          alignItems:   'center',
          justifyContent:'center',
          fontSize:     12,
          border:       '2px solid #0a0a0f',
          pointerEvents:'none',
        }}>
          ✓
        </div>
      )}
    </div>
  )
}
