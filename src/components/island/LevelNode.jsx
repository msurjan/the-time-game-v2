import React from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS, RADIUS, FONT_SIZE } from '../../constants/theme'

const TYPE_ICONS = {
    adventure: '📖',
    trivia: '❓',
    skill: '⚡',
    boss: '💀'
}

export default function LevelNode({ node, unlocked, completed }) {
    const navigate = useNavigate()

    const getBgColor = () => {
        if (completed) return COLORS.nodeComplete
        if (unlocked) return COLORS.nodeActive
        return COLORS.nodeLocked
    }

    const handleClick = () => {
        if (unlocked || completed) {
            navigate(`/game/${node.id}`)
        }
    }

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'absolute',
                left: 500 + node.positionRelative.x,
                top: 350 + node.positionRelative.y,
                transform: 'translate(-50%, -50%)',
                width: 60,
                height: 60,
                backgroundColor: getBgColor(),
                border: `3px solid ${unlocked ? COLORS.accent : COLORS.border}`,
                borderRadius: RADIUS.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                zIndex: 10,
                transition: 'all 0.3s ease',
                boxShadow: unlocked ? `0 0 15px ${COLORS.accent}44` : 'none',
            }}
        >
            <span style={{ fontSize: FONT_SIZE.xl }}>
                {completed ? '✅' : TYPE_ICONS[node.type]}
            </span>
            <div style={{
                position: 'absolute',
                top: 65,
                width: 120,
                textAlign: 'center',
                fontSize: FONT_SIZE.sm,
                color: unlocked ? COLORS.textPrimary : COLORS.textSecondary,
                fontWeight: 'bold'
            }}>
                {node.name}
            </div>
        </div>
    )
}