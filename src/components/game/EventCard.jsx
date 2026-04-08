import React from 'react'
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme'

export default function EventCard({ question, showFeedback }) {
    if (!question) return null;

    // 1. ESTADO DE ESPERA: Mientras el jugador decide
    if (!showFeedback) {
        return (
            <div style={{
                width: '100%', maxWidth: '850px', height: '180px',
                background: 'rgba(255, 255, 255, 0.02)', borderRadius: RADIUS.lg,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: `1px dashed ${COLORS.border}`, marginBottom: SPACING.xl,
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{ fontSize: '40px', marginBottom: '10px', animation: 'pulse 2s infinite' }}>⌛</div>
                <p style={{ letterSpacing: '3px', fontSize: '0.7rem', color: COLORS.textSecondary, textTransform: 'uppercase' }}>
                    Sincronizando flujo temporal...
                </p>
            </div>
        );
    }

    // 2. ESTADO DE REVELACIÓN (Diseño V1 "Espejo"): Mostramos ambos eventos
    const events = [question.event1, question.event2];
    const correctAnswerIndex = question.answer;

    return (
        <div style={{
            display: 'flex', gap: SPACING.lg, width: '100%', maxWidth: '900px',
            marginBottom: SPACING.xl, animation: 'fadeIn 0.5s ease-out'
        }}>
            {events.map((ev, i) => {
                const isCorrect = i === correctAnswerIndex;

                return (
                    <div key={i} style={{
                        flex: 1, background: COLORS.bgPanel, padding: SPACING.xl,
                        borderRadius: RADIUS.lg,
                        border: `2px solid ${isCorrect ? COLORS.success : COLORS.border}66`,
                        boxShadow: isCorrect ? `0 0 25px ${COLORS.success}22` : 'none',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        textAlign: 'center', position: 'relative', transition: 'all 0.4s'
                    }}>
                        {/* Sello de Correcto/Incorrecto */}
                        <div style={{
                            position: 'absolute', top: -10, right: -10,
                            background: isCorrect ? COLORS.success : COLORS.border,
                            borderRadius: '50%', width: 30, height: 30, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                        }}>
                            {isCorrect ? '✓' : '✗'}
                        </div>

                        <div style={{ fontSize: '50px', marginBottom: SPACING.sm }}>{ev.emoji}</div>

                        <h4 style={{
                            color: isCorrect ? COLORS.success : COLORS.textPrimary,
                            margin: `0 0 ${SPACING.sm}px 0`, fontSize: '1.1rem',
                            minHeight: '2.4em', display: 'flex', alignItems: 'center'
                        }}>
                            {ev.name}
                        </h4>

                        {/* Burbuja del Año (Estilo V1) */}
                        <div style={{
                            display: 'inline-block', padding: '4px 16px',
                            backgroundColor: isCorrect ? COLORS.success : COLORS.bg,
                            color: isCorrect ? COLORS.bg : COLORS.textSecondary,
                            borderRadius: RADIUS.full, fontSize: '1rem', fontWeight: '900',
                            marginBottom: SPACING.md, border: `1px solid ${isCorrect ? COLORS.success : COLORS.border}`,
                            boxShadow: isCorrect ? `0 4px 10px ${COLORS.success}44` : 'none'
                        }}>
                            {Math.abs(ev.year)} {ev.year < 0 ? 'a.C.' : 'd.C.'}
                        </div>

                        {/* Descripción Extensa de Supabase */}
                        <p style={{
                            color: COLORS.textSecondary, fontSize: '0.85rem',
                            lineHeight: '1.6', margin: 0, textAlign: 'justify'
                        }}>
                            {ev.summary || "No hay registro detallado de este evento en el Códice."}
                        </p>
                    </div>
                );
            })}
        </div>
    )
}