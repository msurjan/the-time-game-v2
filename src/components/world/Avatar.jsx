/**
 * Avatar.jsx — El Cronista. Representación visual del jugador en el mapa.
 *
 * Props:
 *   worldX, worldY  — posición en coordenadas del canvas (px)
 *   isMoving        — true mientras transiciona hacia una nueva isla
 *   onClick         — llamado al hacer clic en el avatar (cuando ya llegó)
 */

import { COLORS } from '../../constants/theme.js'

export default function Avatar({ worldX, worldY, isMoving, onClick }) {
  return (
    <div
      onClick={onClick}
      title="El Cronista — clic para entrar a la isla"
      style={{
        position:   'absolute',
        left:       worldX,
        top:        worldY,
        transform:  'translate(-50%, -50%)',
        // Transición suave tipo RPG: llega en 0.6s con ease-in-out
        transition: 'left 0.6s cubic-bezier(0.42, 0, 0.58, 1), top 0.6s cubic-bezier(0.42, 0, 0.58, 1)',
        zIndex:     20,
        cursor:     'pointer',
        userSelect: 'none',
      }}
    >
      {/* Anillo de pulso exterior */}
      <div style={{
        position:        'absolute',
        inset:           -10,
        borderRadius:    '50%',
        border:          `2px solid ${COLORS.accent}`,
        opacity:         isMoving ? 0 : 0.6,
        transition:      'opacity 0.4s',
        animation:       'avatarPulse 2.4s ease-in-out infinite',
        pointerEvents:   'none',
      }} />

      {/* Cuerpo principal */}
      <div style={{
        width:          44,
        height:         44,
        borderRadius:   '50%',
        background:     `radial-gradient(circle at 35% 35%, #ffd166, ${COLORS.accent} 60%, #b87a10)`,
        border:         `3px solid #fff`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       22,
        position:       'relative',
        boxShadow:      isMoving
          ? `0 0 8px 2px rgba(245,166,35,0.4)`
          : `0 0 18px 6px rgba(245,166,35,0.55)`,
        transition:     'box-shadow 0.4s',
      }}>
        🧭
      </div>

      {/* Indicador "ENTRAR" cuando está quieto */}
      {!isMoving && (
        <div style={{
          position:       'absolute',
          top:            '105%',
          left:           '50%',
          transform:      'translateX(-50%)',
          marginTop:      4,
          fontSize:       9,
          letterSpacing:  1,
          color:          COLORS.accent,
          whiteSpace:     'nowrap',
          textTransform:  'uppercase',
          fontWeight:     'bold',
          textShadow:     '0 1px 4px rgba(0,0,0,0.9)',
          pointerEvents:  'none',
        }}>
          clic para entrar
        </div>
      )}
    </div>
  )
}
