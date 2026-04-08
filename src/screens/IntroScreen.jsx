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
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                // Poder del ministro (Distracción)
                if (Math.random() < 0.05) {
                    dispatch({ type: ACTIONS.SET_DEBUFF, payload: 'glitch' });
                    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_DEBUFF }), 2000);
                }
            }, 1000);
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
        if (result.isCorrect) {
            dispatch({ type: ACTIONS.ADD_XP, payload: result.xp });
        } else {
            dispatch({ type: ACTIONS.LOSE_LIFE });
        }
    }

    if (loading || !island) return <div style={{ background: '#02040a', height: '100vh' }} />;

    const currentQ = questions[currentIndex];
    const minister = MINISTERS[island.id] || { comic: '⏳' };

    return (
        <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#0c0e1e', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* TOP ICON (Ministro) */}
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{minister.comic}</div>

                {/* PROGRESS BAR */}
                <div style={{ width: '100%', height: '4px', background: '#1a1d3a', borderRadius: '2px', marginBottom: '20px', position: 'relative' }}>
                    <div style={{ width: `${((currentIndex + 1) / 5) * 100}%`, height: '100%', background: '#a6ff00', transition: 'width 0.3s' }} />
                </div>

                {/* STATS ROW */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ fontSize: '12px' }}>{i < state.lives ? '❤️' : '🖤'}</span>)}
                        {state.isAdmin && (
                            <button onClick={() => dispatch({ type: ACTIONS.REFILL_LIVES })} style={{ marginLeft: '10px', background: 'none', border: '1px solid #7eb8f7', color: '#7eb8f7', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}>+</button>
                        )}
                    </div>
                    <div style={{ background: '#1a1d3a', padding: '5px 15px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        ⏱️ 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </div>
                    <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>{currentIndex + 1}/5</div>
                </div>

                {/* QUESTION */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#a6ff00', fontSize: '1.6rem', margin: '0 0 5px' }}>¿Cuál ocurrió primero?</h1>
                    <p style={{ color: '#a0a0b0', fontSize: '0.8rem', letterSpacing: '1px' }}>{node.theme.toUpperCase()}</p>
                </div>

                {/* EVENTS LADO A LADO */}
                <div style={{ width: '100%', display: 'flex', gap: '15px' }}>
                    {[currentQ.event1, currentQ.event2].map((ev, i) => (
                        <div key={i} style={{ width: '50%' }}>
                            <EventCardV1 event={ev} isCorrectAnswer={i === currentQ.answer} showFeedback={showFeedback} onClick={() => handleAnswer(i)} />
                        </div>
                    ))}
                </div>

                {/* NEXT BUTTON */}
                {showFeedback && (
                    <button
                        onClick={() => {
                            if (currentIndex === questions.length - 1) navigate(`/island/${island.id}`);
                            else { setShowFeedback(false); setTimeLeft(30); setCurrentIndex(c => c + 1); }
                        }}
                        style={{ width: '100%', marginTop: '40px', padding: '15px', background: '#ff7a00', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        SIGUIENTE →
                    </button>
                )}
            </div>
        </div>
    )
}