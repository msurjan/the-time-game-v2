import { POINTS } from '../constants/gameConfig'

// Mapeo de temáticas a Skills del RPG
const TOPIC_TO_SKILL = {
    'Geología': 'geology',
    'Vulcanismo y Tectónica': 'tectonics',
    'Paleontología y Evolución': 'biology',
    'Escala del tiempo geológico': 'geology',
    'Historia de Chile': 'history',
    'Edad Moderna': 'history',
    'Inventos tecnológicos': 'society',
    'Grandes exploradores': 'society'
}

export function evaluateAnswer(question, selectedIndex, timeElapsedMs, isBoss = false) {
    const isCorrect = question.answer === selectedIndex
    const skillKey = TOPIC_TO_SKILL[question.theme] || 'society' // fallback

    if (!isCorrect) {
        return { isCorrect: false, score: 0, skillKey }
    }

    let points = POINTS.correctAnswer
    if (timeElapsedMs < POINTS.speedThresholdMs) points += POINTS.speedBonus

    return {
        isCorrect: true,
        score: points,
        skillKey, // Enviamos qué habilidad debe subir
        xp: points,
        gold: Math.floor(points / 2)
    }
}