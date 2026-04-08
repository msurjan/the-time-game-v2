import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame, ACTIONS } from '../store/gameStore'
import { getQuestionsForNode } from '../constants/questions'
import { getNodeById } from '../constants/islands'
import { evaluateAnswer } from '../core/gameEngine'
import { MINISTERS } from '../constants/ministers'
import EventCardV1 from '../components/game/EventCardV1'

export default function GameScreen() {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  const nodeData = getNodeById(nodeId);
  const { node, island } = nodeData || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // 📥 CARGA DE PREGUNTAS
  useEffect(() => {
    async function load() {
      if (!node || !island) return;
      try {
        const q = await getQuestionsForNode(island.eraId, node.theme, 'first', 5);
        setQuestions(q);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar preguntas:", err);
        setSyncError(true);
      }
    }
    load();
  }, [nodeId, island, node]);

  // 🛡️ SEGURIDAD: Evitar pantalla en negro infinita
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setSyncError(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [loading]);

  // ⏱️ LÓGICA DEL CRONÓMETRO
  useEffect(() => {
    if (timeLeft > 0 && !showFeedback && !loading && questions.length > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showFeedback && !loading) {
      handleAnswer(-1);
    }
  }, [timeLeft, showFeedback, loading, questions]);

  const handleAnswer = (index) => {
    if (showFeedback || questions.length === 0) return;
    const currentQ = questions[currentIndex];
    const result = evaluateAnswer(currentQ, index, 0, false);
    setLastResult(result);
    setShowFeedback(true);

    if (result.isCorrect) {
      dispatch({ type: ACTIONS.ADD_XP, payload: result.xp });
    } else {
      dispatch({ type: ACTIONS.LOSE_LIFE });
    }
  }

  // 🛑 ESTADOS DE CARGA Y ERROR
  if (syncError) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020511', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#ff4b4b' }}>⚠️ ERROR DE SINCRONIZACIÓN</h2>
        <p style={{ opacity: 0.7, margin: '15px 0' }}>No pudimos conectar con el Códice. Revisa tu conexión o sesión.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 25px', background: '#ff7a00', border: 'none', color: 'white', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Reintentar</button>
      </div>
    );
  }

  if (loading || !island || questions.length === 0) {
    return <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020511', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a6ff00' }}>
      <h2 style={{ letterSpacing: '2px', animation: 'pulse 1.5s infinite' }}>SINCRONIZANDO...</h2>
    </div>;
  }

  // ✅ DEFINICIÓN DE VARIABLES PARA EL RENDER
  const currentQ = questions[currentIndex];
  const minister = MINISTERS[island.id] || { name: "Cronos", comic: "🌀", quote: "Nadie escapa al tiempo" };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#020511', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>

      {/* 1. CABECERA (Estilo Vercel V1) */}
      <div style={{ width: '100%', maxWidth: '500px', padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <button onClick={() => navigate(`/island/${island.id}`)} style={{ background: '#1a1d3a', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>← Temas</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/admin')} style={{ background: '#1a1d3a', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>ADMIN</button>
            <button style={{ background: '#1a1d3a', border: 'none', color: 'white', padding: '8px', borderRadius: '8px' }}>👤</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', background: '#0b0e20', padding: '8px', borderRadius: '5px', fontSize: '0.85rem', border: '1px solid #1a1d3a', color: '#a0a0b0' }}>
          🎯 Misión: Racha de 10
        </div>
      </div>

      {/* 2. ÁREA DEL MINISTRO */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '65px', marginBottom: '10px' }}>{minister.comic}</div>
        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.1rem' }}>{minister.name}</h3>
        <p style={{ color: '#a0a0b0', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '5px' }}>"{minister.quote}"</p>
      </div>

      {/* 3. INDICADORES DE ESTADO (Badges) */}
      <div style={{ width: '100%', maxWidth: '450px', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ background: '#1a1d3a', padding: '6px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>⚡ ¿Cuál fue primero?</div>
          <div style={{ background: '#301414', color: '#ff4b4b', padding: '6px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #ff4b4b' }}>
            ⏱️ 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
          <div style={{ background: '#112211', color: '#a6ff00', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid #a6ff00' }}>✓ 1</div>
          <div style={{ background: '#1a1d3a', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem' }}>{currentIndex + 1}/5</div>
          {state.isAdmin && (
            <button onClick={() => dispatch({ type: ACTIONS.REFILL_LIVES })} style={{ background: '#7eb8f7', border: 'none', borderRadius: '50%', width: '26px', height: '26px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: '16px' }}>{i < state.lives ? '❤️' : '🖤'}</span>
          ))}
        </div>
        <div style={{ width: '100%', height: '6px', background: '#1a1d3a', borderRadius: '3px', marginBottom: '30px' }}>
          <div style={{ width: `${((currentIndex + 1) / 5) * 100}%`, height: '100%', background: '#a6ff00', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
      </div>

      {/* 4. PREGUNTA */}
      <div style={{ textAlign: 'center', marginBottom: '30px', padding: '0 20px' }}>
        <h1 style={{ color: '#a6ff00', fontSize: '1.8rem', fontWeight: '900', margin: '0' }}>¿Cuál ocurrió primero?</h1>
        <p style={{ color: '#a0a0b0', fontSize: '0.9rem', margin: '10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{node.theme}</p>
      </div>

      {/* 5. EVENTOS (Side-by-Side) */}
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', gap: '15px', padding: '0 15px', boxSizing: 'border-box' }}>
        {[currentQ.event1, currentQ.event2].map((ev, i) => (
          <div key={i} style={{ flex: 1 }}>
            <EventCardV1
              event={ev}
              isCorrectAnswer={i === currentQ.answer}
              showFeedback={showFeedback}
              onClick={() => handleAnswer(i)}
            />
          </div>
        ))}
      </div>

      {/* 6. BOTÓN SIGUIENTE */}
      {showFeedback && (
        <div style={{ marginTop: '30px', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 20px', animation: 'fadeIn 0.4s' }}>
          <button
            onClick={() => {
              if (currentIndex === questions.length - 1) navigate(`/island/${island.id}`);
              else { setShowFeedback(false); setTimeLeft(30); setCurrentIndex(c => c + 1); }
            }}
            style={{ width: '100%', padding: '18px', background: '#ff7a00', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(255,122,0,0.4)' }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}