import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getIslandById } from '../constants/islands' // Importamos el helper
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme'
import IslandNavigator from '../components/island/IslandNavigator'

export default function IslandViewScreen() {
  const { islandId } = useParams()
  const navigate = useNavigate()

  // Buscamos la isla usando el ID de la URL
  const island = getIslandById(islandId)

  if (!island) {
    return (
      <div style={{ padding: 40, color: COLORS.danger, backgroundColor: COLORS.bg, height: '100vh' }}>
        ⚠️ Isla no encontrada: {islandId}
      </div>
    )
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: COLORS.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Cabecera con el Lore de la Era */}
      <div style={{
        width: '1000px',
        padding: SPACING.md,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: COLORS.accent, margin: 0, fontSize: FONT_SIZE.xl }}>{island.name}</h1>
          <p style={{ color: COLORS.textSecondary, margin: 0 }}>{island.description}</p>
        </div>
        <button
          onClick={() => navigate('/world')}
          style={{
            padding: '10px 20px',
            backgroundColor: COLORS.bgPanel,
            color: COLORS.textPrimary,
            border: `1px solid ${COLORS.accent}`,
            borderRadius: 8,
            cursor: 'pointer',
            transition: '0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = COLORS.nodeActive}
          onMouseOut={(e) => e.target.style.backgroundColor = COLORS.bgPanel}
        >
          Volver al Mundo
        </button>
      </div>

      {/* El Mapa de Nodos tipo Super Mario 3 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IslandNavigator island={island} />
      </div>
    </div>
  )
}