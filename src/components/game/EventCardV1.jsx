import React from 'react'

export default function EventCardV1({ event, isCorrectAnswer, showFeedback, onClick }) {
    if (!event) return null;
    const borderColor = showFeedback ? (isCorrectAnswer ? '#a6ff00' : '#1a1d3a') : '#1a1d3a';

    return (
        <div
            onClick={onClick}
            style={{
                width: '100%', minHeight: '300px', background: '#0e1122', borderRadius: '20px',
                padding: '20px 15px', border: `3px solid ${borderColor}`, cursor: showFeedback ? 'default' : 'pointer',
                boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s'
            }}
        >
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>{event.emoji}</div>
            {showFeedback && (
                <div style={{ background: '#8b5cf6', color: 'white', padding: '4px 15px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
                    {Math.abs(event.year)} {event.year < 0 ? 'a.C.' : 'd.C.'}
                </div>
            )}
            <h3 style={{ margin: '0 0 15px', fontSize: '1rem', fontWeight: 'bold', lineHeight: '1.3' }}>{event.name}</h3>
            {showFeedback && (
                <p style={{ color: '#a0a0b0', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>
                    {event.summary}
                </p>
            )}
        </div>
    )
}