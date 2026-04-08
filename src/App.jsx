import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginScreen from './screens/LoginScreen.jsx'
import IntroScreen from './screens/IntroScreen.jsx' // 👈 La nueva pantalla narrativa
import WorldMapScreen from './screens/WorldMapScreen.jsx'
import IslandViewScreen from './screens/IslandViewScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'

/**
 * App.jsx — Enrutador Maestro.
 * Define el orden lógico: Login -> Intro -> Mundo -> Islas -> Juego.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. REDIRECCIÓN INICIAL: Todo usuario empieza en Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. AUTENTICACIÓN: Pantalla de acceso con Google */}
        <Route path="/login" element={<LoginScreen />} />

        {/* 3. NARRATIVA: Prólogo sobre Grump y la Biblioteca */}
        <Route path="/intro" element={<IntroScreen />} />

        {/* 4. OVERWORLD: El mapa del mundo con el Radar RPG */}
        <Route path="/world" element={<WorldMapScreen />} />

        {/* 5. EXPLORACIÓN: Vista detallada de cada isla */}
        <Route path="/island/:islandId" element={<IslandViewScreen />} />

        {/* 6. ACCIÓN: Motor de trivia y aventura */}
        <Route path="/game/:nodeId" element={<GameScreen />} />

        {/* 404: Si alguien escribe una URL rara, lo devolvemos al mundo */}
        <Route path="*" element={<Navigate to="/world" replace />} />
      </Routes>
    </BrowserRouter>
  )
}