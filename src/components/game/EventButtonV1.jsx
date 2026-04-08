import React from 'react'
import { COLORS, RADIUS, SPACING } from '../../constants/theme'

export default function EventButtonV1({
    event,
    index,
    handleAnswer,
    showFeedback,
    isCorrect,
    correctAnswerIndex
}) {
    if (!event) return null;

    // Estilos de estado
    const isThisCorrect = index === correctAnswerIndex;
    const wasSelected = showFeedback && isCorrect !== null; // Placeholder para lógica de selección

    return (
        <button
            onClick={() => handleAnswer(index)}
            disabled={showFeedback}
            style={{
                flex: 1,
                backgroundColor: '#0c0e1e',
                border: `2px solid ${showFeedback ? (isThisCorrect ? '#4caf50' : '#30344a') : '#7eb8f7'}`,
                borderRadius: RADIUS.md,
                padding: SPACING.lg,
                cursor: showFeedback ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: !showFeedback ? '0 0 15px rgba(126, 184, 247, 0.2)' : 'none',
                transform: !showFeedback ? 'scale(1)' : 'scale(0.98)',
            }}
        >
            {/* Efecto de escaneo neón (decorativo) */}
            {!showFeedback && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                    background: 'linear-gradient(90deg, transparent, #7eb8f7, transparent)',
                    animation: 'scan 2s linear infinite'
                }} />
            )}

            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{event.emoji}</div>

            <div style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                {event.name}
            </div>

            {/* REVELACIÓN DE AÑO (Solo en feedback) */}
            {showFeedback && (
                <div style={{
                    marginTop: '15px',
                    padding: '4px 12px',
                    backgroundColor: isThisCorrect ? '#4caf50' : '#1a1d3a',
                    color: isThisCorrect ? '#0c0e1e' : '#7eb8f7',
                    borderRadius: RADIUS.full,
                    fontWeight: '900',
                    fontSize: '1.2rem',
                    border: `1px solid ${isThisCorrect ? '#4caf50' : '#7eb8f7'}`
                }}>
                    {Math.abs(event.year)} {event.year < 0 ? 'a.C.' : 'd.C.'}
                </div>
            )}

            <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
      `}</style>
        </button>
    )
}