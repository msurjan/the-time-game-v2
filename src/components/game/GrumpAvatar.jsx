import React from 'react'
import { COLORS } from '../../constants/theme'
import { MINISTERS } from '../../constants/ministers';

export default function GrumpAvatar({ nodeId, hideQuote }) {
    // 1. Extraemos el prefijo de la isla (ej: n01) para saber qué ministro mostrar
    const islandPrefix = nodeId?.split('_')[0];
    const ministerKey = `${islandPrefix}_boss`;

    // Si no encontramos ministro, usamos a Grump como fallback
    const current = MINISTERS[ministerKey] || {
        name: "Grump",
        title: "Dictador Supremo",
        comic: "🐷",
        quote: "La historia es una construcción que yo controlo."
    };

    return (
        <div style={{
            textAlign: 'center',
            border: `2px solid ${current.name === 'Grump' ? COLORS.danger : COLORS.accent}`,
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Fondo decorativo sutil */}
            <div style={{
                position: 'absolute', top: '-20%', left: '-20%', fontSize: '150px',
                opacity: 0.05, pointerEvents: 'none'
            }}>
                {current.comic}
            </div>

            <div style={{
                fontSize: '90px', marginBottom: '10px',
                filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))',
                position: 'relative'
            }}>
                {current.comic}
                {current.name === "Grump" && (
                    <span style={{ position: 'absolute', top: 0, right: '20%', fontSize: '25px' }}>👑</span>
                )}
            </div>

            <h3 style={{
                color: COLORS.textPrimary, letterSpacing: '2px',
                textTransform: 'uppercase', margin: '10px 0 5px', fontSize: '1.1rem'
            }}>
                {current.name}
            </h3>

            <p style={{
                color: COLORS.accent, fontSize: '0.7rem',
                fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '1px'
            }}>
                {current.title}
            </p>

            {/* 👈 La frase se ha eliminado de aquí porque ahora vive en el GameScreen */}
        </div>
    )
}