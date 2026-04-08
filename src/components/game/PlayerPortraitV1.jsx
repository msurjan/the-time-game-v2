import React from 'react'

export default function PlayerPortraitV1({ skills, eraId }) {
    // Mapeo de nombres técnicos a etiquetas visibles
    const skillLabels = {
        history: 'Historia',
        geology: 'Geología',
        society: 'Sociedad',
        biology: 'Biología',
        tectonics: 'Tectónica'
    };

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#0c0e1e',
            borderRight: '2px solid #7eb8f7', // Borde neón azul lateral
            boxShadow: 'inset -10px 0 20px rgba(126, 184, 247, 0.1)',
            padding: '20px',
            border: '1px solid #1a1d3a',
            borderRadius: '4px'
        }}>
            {/* Área del Avatar (El Cronista) */}
            <div style={{
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '110px',
                filter: 'drop-shadow(0 0 20px rgba(126, 184, 247, 0.4))',
                marginBottom: '10px'
            }}>
                👤
            </div>

            {/* Identificación */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{
                    color: '#7eb8f7',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    fontSize: '1.2rem'
                }}>
                    El Cronista
                </h3>
                <p style={{
                    color: '#a0a0b0',
                    fontSize: '0.65rem',
                    margin: '5px 0 0 0',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>
                    Sincronía: {eraId?.replace('_', ' ') || 'Incierta'}
                </p>
            </div>

            {/* PANEL DE HABILIDADES (RPG Stats) */}
            <div style={{
                flex: 1,
                background: 'rgba(126, 184, 247, 0.05)',
                border: '1px solid rgba(126, 184, 247, 0.2)',
                borderRadius: '4px',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <h4 style={{
                    color: '#7eb8f7',
                    fontSize: '0.7rem',
                    margin: '0 0 5px 0',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    letterSpacing: '2px'
                }}>
                    Atributos del Códice
                </h4>

                {Object.entries(skills).map(([key, value]) => (
                    <div key={key} style={{ width: '100%' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.65rem',
                            color: '#a0a0b0',
                            marginBottom: '3px',
                            textTransform: 'uppercase'
                        }}>
                            <span>{skillLabels[key] || key}</span>
                            <span>{value}</span>
                        </div>
                        {/* Barra de Progreso de Habilidad */}
                        <div style={{
                            width: '100%',
                            height: '4px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${Math.min((value / 20) * 100, 100)}%`,
                                height: '100%',
                                background: '#7eb8f7',
                                boxShadow: '0 0 10px #7eb8f7'
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}