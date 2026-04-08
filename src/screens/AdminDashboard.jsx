import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { COLORS, RADIUS, SPACING } from '../constants/theme'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    // 1. 📥 Carga de Datos Reales desde Supabase
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('xp', { ascending: false }); // Los mejores primero

                if (error) throw error;
                setUsers(data || []);
            } catch (e) {
                console.error("Error cargando dashboard:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    // 2. 📊 Cálculo de Métricas (Basado en la data real)
    const totalUsers = users.length;
    const totalNodesCompleted = users.reduce((acc, user) => acc + (user.completed_nodes?.length || 0), 0);
    const avgNodesPerUser = totalUsers > 0 ? (totalNodesCompleted / totalUsers).toFixed(1) : 0;

    // Usuarios recurrentes (ej: los que han completado más de 1 nodo)
    const recurrentUsers = users.filter(u => (u.completed_nodes?.length || 0) > 1).length;
    const retentionRate = totalUsers > 0 ? Math.round((recurrentUsers / totalUsers) * 100) : 0;

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Sincronizando métricas del Códice...</div>

    return (
        <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '30px', fontFamily: 'sans-serif', color: '#1e293b' }}>

            {/* HEADER (Imagen 2) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ color: '#6366f1', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        📊 Dashboard Admin
                    </h1>
                    <p style={{ color: '#64748b', margin: 0 }}>The Time Game • Datos en Vivo desde Supabase</p>
                </div>
                <button onClick={() => navigate('/world')} style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ← Volver al Mundo
                </button>
            </div>

            {/* METRIC CARDS (Basadas en Usuarios Reales) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <MetricCard label="USUARIOS TOTALES" value={totalUsers} sub="registrados en el sistema" color="#6366f1" />
                <MetricCard label="NODOS RESCATADOS" value={totalNodesCompleted} sub="total acumulado" color="#f59e0b" />
                <MetricCard label="RETENCIÓN" value={`${retentionRate}%`} sub="jugadores recurrentes" color="#10b981" />
                <MetricCard label="AVG NODOS/USER" value={avgNodesPerUser} sub="objetivo: > 8" color="#0ea5e9" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>

                {/* LISTA DE USUARIOS (Imagen 4 y 5) */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>🏆 Top Jugadores</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {users.slice(0, 10).map((user, index) => (
                            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: index < 3 ? '#fbbf24' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{user.id.substring(0, 8)}... (Nivel {Math.floor(user.xp / 100) + 1})</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.completed_nodes?.length || 0} nodos • {user.xp} XP</div>
                                </div>
                                <div style={{ fontSize: '1.2rem' }}>🔥 {user.gold > 50 ? '16' : '1'}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* OBJETIVOS SPRINT (Imagen 2 inferior) */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>🎯 Objetivos de Engagement</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <ProgressBar label="Meta Usuarios (Sprint 1)" current={totalUsers} target={50} color="#10b981" />
                        <ProgressBar label="Tasa de Retención > 30%" current={retentionRate} target={30} color="#10b981" />
                        <ProgressBar label="Promedio Nodos/Sesión" current={parseFloat(avgNodesPerUser)} target={8} color="#f59e0b" />
                    </div>
                </div>

            </div>
        </div>
    )
}

function MetricCard({ label, value, sub, color }) {
    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: `4px solid ${color}` }}>
            <p style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{label}</p>
            <h2 style={{ color: '#1e293b', fontSize: '2.2rem', margin: '0 0 5px 0' }}>{value}</h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{sub}</p>
        </div>
    )
}

function ProgressBar({ label, current, target, color }) {
    const percent = Math.min((current / target) * 100, 100)
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span>{label}</span>
                <span style={{ fontWeight: 'bold', color }}>{current} / {target}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${percent}%`, height: '100%', background: color, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
        </div>
    )
}