import React from 'react'

export default function GrumpPortraitV1({ minister, isEscaping, activeDebuff }) {
    if (!minister) return <div style={{ height: '80px' }}>⌛</div>;
    const isAttacking = activeDebuff !== null;

    return (
        <div style={{ textAlign: 'center', marginBottom: '10px', width: '100%' }}>
            <div style={{
                fontSize: '70px', transition: 'all 0.3s',
                transform: isAttacking ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                filter: isAttacking ? 'drop-shadow(0 0 15px #ff4b4b)' : 'none'
            }}>
                {minister.comic || '👤'}
            </div>
            <h3 style={{ margin: '5px 0', fontSize: '0.9rem', color: isAttacking ? '#ff4b4b' : 'white' }}>
                {(minister.name || 'Enemigo').toUpperCase()}
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', fontStyle: 'italic', color: '#a0a0b0', minHeight: '2.5em' }}>
                "{isEscaping ? (minister.escape || '¡Te atraparé luego!') : (isAttacking ? "¡Toma esto, Cronista!" : (minister.quote || '...'))}"
            </p>
        </div>
    )
}