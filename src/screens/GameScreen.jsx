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
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    async function load() {
      if (!node || !island) return;
      const q = await getQuestionsForNode(island.eraId, node.theme, 'first', 5);
      setQuestions(q);
      setLoading(false);
    }
    load();
  }, [nodeId]);

  useEffect(() => {
    if (timeLeft > 0 && !showFeedback && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleAnswer(-1);
    }
  }, [timeLeft, showFeedback, loading]);

  const handleAnswer = (index) => {
    if (showFeedback || questions.length === 0) return;
    const result = evaluateAnswer(questions[currentIndex], index, 0, false);
    setLastResult(result);
    setShowFeedback(true);
    if (result.isCorrect) dispatch({ type: ACTIONS.ADD_XP, payload: result.xp });
    else dispatch({ type: ACTIONS.LOSE_LIFE });
  }

  if (loading || !island) return <div style={{ background: '#02040a', height: '100vh' }} />;

  const currentQ = questions[currentIndex];
  // Buscamos al ministro real de la isla
  const minister = MINISTERS[island.id] || { name: "Cronos", comic: "🌀", quote: "Nadie escapa al tiempo" };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#020511', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>

      {/* 1. TOP BAR (Igual a imagen Vercel) */}
      <div style={{ width: '100%', maxWidth: '500px', padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <button onClick={() => navigate(`/island/${island.id}`)} style={{ background: '#1a1d3a', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>← Temas</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ background: '#1a1d3a', border: 'none', color: 'white', padding: '8px', borderRadius: '8px' }}>❓</button>
            <button onClick={() => navigate('/admin')} style={{ background: '#1a1d3a', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>ADMIN</button>
            <button style={{ background: '#1a1d3a', border: 'none', color: 'white', padding: '8px', borderRadius: '8px' }}>👤</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '5px', fontSize: '0.8rem' }}>
          🎯 Misión: Racha de 10
        </div>
      </div>

      {/* 2. AREA DEL MINISTRO (Reemplaza a Cronos) */}
      <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
        <div style={{ fontSize: '60px', marginBottom: '5px' }}>{minister.comic}</div>
        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1rem' }}>{minister.name}</h3>
        <p style={{ color: '#a0a0b0', fontSize: '0.8rem', fontStyle: 'italic', margin: '5px 0' }}>"{minister.quote}"</p>
      </div>

      {/* 3. STATUS BAR (Timer, Corazones, Progreso) */}
      <div style={{ width: '100%', maxWidth: '450px', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ background: '#1a1d3a', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>⚡ ¿Cuál fue primero?</div>
          <div style={{ background: '#301414', color: '#ff4b4b', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>⏱️ 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
          <div style={{ background: '#112211', color: '#a6ff00', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>✓ {state.completedNodes?.length || 0}</div>
          <div style={{ background: '#1a1d3a', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>{currentIndex + 1}/5</div>
        </div>

        {/* CORAZONES Y BARRA */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ fontSize: '14px' }}>{i < state.lives ? '❤️' : '🖤'}</span>)}
        </div>
        <div style={{ width: '100%', height: '4px', background: '#1a1d3a', borderRadius: '2px' }}>
          <div style={{ width: `${((currentIndex + 1) / 5) * 100}%`, height: '100%', background: '#a6ff00', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* 4. PREGUNTA CENTRAL */}
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <h1 style={{ color: '#a6ff00', fontSize: '1.8rem', fontWeight: '900', margin: '0' }}>¿Cuál ocurrió primero?</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0' }}>{node.theme}</p>
      </div>

      {/* 5. EVENTOS LADO A LADO */}
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', gap: '12px', padding: '0 15px', boxSizing: 'border-box' }}>
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

      {/* 6. FEEDBACK FINAL */}
      {showFeedback && (
        <div style={{ marginTop: '30px', textAlign: 'center', width: '100%', maxWidth: '500px', padding: '0 20px', boxSizing: 'border-box' }}>
          <div style={{ background: '#a6ff00', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '30px' }}>✓</div>
          <h2 style={{ margin: '0 0 20px', fontSize: '1.5rem', fontWeight: 'bold' }}>¡Correcto!</h2>
          <button
            onClick={() => {
              if (currentIndex === questions.length - 1) navigate(`/island/${island.id}`);
              else { setShowFeedback(false); setTimeLeft(30); setCurrentIndex(c => c + 1); }
            }}
            style={{ width: '100%', padding: '18px', background: '#ff7a00', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}