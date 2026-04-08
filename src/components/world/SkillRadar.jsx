import React from 'react'
import { COLORS, FONT_SIZE } from '../../constants/theme'

// Ejes y etiquetas del RPG
const SKILL_LABELS = {
    geology: 'Estratos',
    tectonics: 'Procesos',
    biology: 'Biología',
    history: 'Hitos',
    society: 'Cultura'
}

// Configuración del Radar SVG
const SIZE = 150;
const CENTER = SIZE / 2;
const MAX_RADIUS = 60; // Radio máximo del gráfico
const SKILL_AXES = ['geology', 'tectonics', 'biology', 'history', 'society'];
const MAX_SKILL_POINTS = 10; // Escala máxima visible inicial

export default function SkillRadar({ skills = {} }) {
    // Calculamos los puntos en el círculo (separados por 72 grados)
    const getPoint = (radius, angleDeg) => {
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        return {
            x: CENTER + radius * Math.cos(angleRad),
            y: CENTER + radius * Math.sin(angleRad)
        };
    }

    // Normalizamos los puntos de habilidad (ej: 5 puntos = 50% del radio)
    const skillPoints = SKILL_AXES.map(key => {
        const points = skills[key] || 0;
        const normalizedPoints = Math.min(points, MAX_SKILL_POINTS);
        return (normalizedPoints / MAX_SKILL_POINTS) * MAX_RADIUS;
    });

    // Dibujamos la rejilla hexagonal (Grid de fondo)
    // Cambia estas líneas dentro del componente:
    const renderGrid = () => {
        return [0.25, 0.5, 0.75, 1].map(scale => {
            const radius = scale * MAX_RADIUS;
            const points = SKILL_AXES.map((_, i) => getPoint(radius, i * 72)).map(p => `${p.x},${p.y}`).join(' ');
            return <polygon key={scale} points={points} fill="none" stroke="rgba(126, 184, 247, 0.3)" strokeWidth={1} />; // 👈 Más brillo
        });
    }

    const renderSkillPolygon = () => {
        // 👈 FIX: Si todo es 0, dibujamos un punto mínimo para que no desaparezca
        const hasPoints = skillPoints.some(p => p > 0);
        const displayPoints = hasPoints ? skillPoints : skillPoints.map(() => 2); // 2px de radio base

        const points = displayPoints
            .map((radius, i) => getPoint(radius, i * 72))
            .map(p => `${p.x},${p.y}`)
            .join(' ');

        return (
            <polygon
                points={points}
                fill="rgba(192, 132, 252, 0.4)" // Púrpura traslúcido
                stroke="#c084fc"
                strokeWidth={2}
                style={{ transition: 'points 0.8s ease' }}
            />
        )
    }
    // Dibujamos las etiquetas de texto
    const renderLabels = () => {
        return SKILL_AXES.map((key, i) => {
            const radius = MAX_RADIUS + 15;
            const point = getPoint(radius, i * 72);
            return (
                <text
                    key={key}
                    x={point.x}
                    y={point.y + 4} // Centrado vertical manual
                    textAnchor="middle"
                    fill={COLORS.textSecondary}
                    fontSize={FONT_SIZE.xs}
                    fontWeight="bold"
                >
                    {SKILL_LABELS[key]}
                </text>
            )
        });
    }

    return (
        <div style={{ padding: '10px', backgroundColor: `${COLORS.bgPanel}88`, borderRadius: '15px', border: `1px solid ${COLORS.border}` }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                {renderGrid()}
                {SKILL_AXES.map((_, i) => { // Dibujamos los ejes
                    const point = getPoint(MAX_RADIUS, i * 72);
                    return <line key={i} x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} stroke={COLORS.border} strokeWidth={0.5} opacity={0.3} />
                })}
                {renderSkillPolygon()}
                {renderLabels()}
            </svg>
        </div>
    )
}