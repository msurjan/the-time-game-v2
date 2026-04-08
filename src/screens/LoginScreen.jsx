import React from 'react'
import { supabase } from '../lib/supabaseClient'
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme'

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    // 👈 Detectamos si estamos en localhost o en producción automáticamente
    const targetUrl = window.location.origin + '/intro';

    console.log("Intentando redirección a:", targetUrl); // Para tu tranquilidad en consola

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetUrl
      }
    })

    if (error) console.error("Error de Auth:", error.message)
  }

  return (
    <div style={{
      width: '100vw', height: '100vh', backgroundColor: COLORS.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: SPACING.xxl }}>
        <h1 style={{ color: COLORS.accent, fontSize: 48, marginBottom: 0 }}>THE TIME GAME</h1>
        <p style={{ color: COLORS.textSecondary, letterSpacing: 2 }}>RECONSTRUYE LA HISTORIA</p>
      </div>

      <button
        onClick={handleGoogleLogin}
        style={{
          padding: '16px 32px', backgroundColor: COLORS.bgPanel, color: COLORS.textPrimary,
          border: `1px solid ${COLORS.accent}`, borderRadius: RADIUS.md, cursor: 'pointer',
          fontSize: FONT_SIZE.lg, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 12,
          transition: 'transform 0.1s'
        }}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
      >
        <span>🌐</span> Entrar con Google
      </button>
    </div>
  )
}