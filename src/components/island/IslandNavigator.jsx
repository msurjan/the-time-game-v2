import React from 'react'
import { COLORS, SPACING } from '../../constants/theme'
import { useGame, isNodeCompleted, isNodeUnlocked } from '../../store/gameStore'
import LevelNode from './LevelNode'

// ESTA LÍNEA ES LA CLAVE:
export default function IslandNavigator({ island }) {
    const { state } = useGame()

    // Función para dibujar las líneas de conexión (Caminos)
    const renderConnections = () => {
        return (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                {island.nodes.map(node =>
                    node.dependencies.map(depId => {
                        const depNode = island.nodes.find(n => n.id === depId)
                        if (!depNode) return null

                        const isCompleted = isNodeCompleted(state, depId)
                        return (
                            <line
                                key={`${depId}-${node.id}`}
                                x1={500 + depNode.positionRelative.x}
                                y1={350 + depNode.positionRelative.y}
                                x2={500 + node.positionRelative.x}
                                y2={350 + node.positionRelative.y}
                                stroke={isCompleted ? COLORS.success : COLORS.border}
                                strokeWidth={4}
                                strokeDasharray={isCompleted ? "0" : "8,4"}
                                style={{ transition: 'stroke 0.5s ease' }}
                            />
                        )
                    })
                )}
            </svg>
        )
    }

    return (
        <div style={{ position: 'relative', width: '1000px', height: '700px', overflow: 'hidden', background: COLORS.bg }}>
            {renderConnections()}
            {island.nodes.map(node => (
                <LevelNode
                    key={node.id}
                    node={node}
                    unlocked={isNodeUnlocked(state, node.id)}
                    completed={isNodeCompleted(state, node.id)}
                />
            ))}
        </div>
    )
}