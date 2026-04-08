import React, { useEffect, useState } from 'react'
import { useGame, ACTIONS } from '../store/gameStore'
import { supabase } from '../lib/supabaseClient'
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme'

export default function LibraryScreen() {
    const { state, dispatch } = useGame()
    const [catalog, setCatalog] = useState([])

    useEffect(() => {
        // Cargamos los libros disponibles en el Marketplace
        const fetchLibrary = async () => {
            const { data } = await supabase.from('library_items').select('*')
            if (data) setCatalog(data)
        }
        fetchLibrary()
    }, [])

    const handleBuy = async (item) => {
        if (state.gold < item.price_gold) return alert("Oro insuficiente")

        // 1. Descontar oro en el store
        dispatch({ type: ACTIONS.ADD_GOLD, payload: -item.price_gold })

        // 2. Registrar propiedad en Supabase
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from('user_library').insert({ user_id: user.id, item_id: item.id })

        // 3. Añadir al inventario local
        dispatch({ type: ACTIONS.ADD_TO_INVENTORY, payload: item.id })
    }

    return (
        <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: COLORS.bg, padding: SPACING.xl }}>
            <h1 style={{ color: COLORS.accent, textAlign: 'center', marginBottom: SPACING.xxl }}>LA GRAN BIBLIOTECA</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: SPACING.xl }}>
                {catalog.map(book => (
                    <BookTome
                        key={book.id}
                        book={book}
                        isOwned={state.playerInventory.includes(book.id)}
                        onBuy={() => handleBuy(book)}
                    />
                ))}
            </div>
        </div>
    )
}

function BookTome({ book, isOwned, onBuy }) {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)', borderRadius: RADIUS.lg, padding: SPACING.lg,
            border: `1px solid ${isOwned ? COLORS.accent : COLORS.border}`, textAlign: 'center',
            opacity: isOwned ? 1 : 0.7
        }}>
            <div style={{ fontSize: 50, marginBottom: SPACING.md }}>{isOwned ? '📖' : '🔒'}</div>
            <h3 style={{ color: COLORS.textPrimary, fontSize: FONT_SIZE.md }}>{book.title}</h3>
            <p style={{ color: COLORS.textSecondary, fontSize: FONT_SIZE.xs }}>{book.era}</p>

            {!isOwned ? (
                <button
                    onClick={onBuy}
                    style={{
                        marginTop: SPACING.md, padding: '8px 16px', backgroundColor: COLORS.gold,
                        color: COLORS.bg, border: 'none', borderRadius: RADIUS.md, fontWeight: 'bold'
                    }}
                >
                    {book.price_gold} 💰
                </button>
            ) : (
                <div style={{ color: COLORS.accent, fontWeight: 'bold', marginTop: SPACING.md }}>RESCATADO</div>
            )}
        </div>
    )
}