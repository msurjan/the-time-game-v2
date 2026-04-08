import { createContext, useContext, useReducer, useEffect } from 'react'
import { LIVES } from '../constants/gameConfig.js'
import { getUnlockableNodes } from '../constants/islands.js'
import { supabase } from '../lib/supabaseClient'

const ADMIN_EMAIL = 'marcelosurjan@gmail.com';

const INITIAL_STATE = {
  lives: LIVES.initial,
  xp: 0,
  gold: 0,
  isAdmin: false,
  unlockedIslands: ['island_01', 'island_06'],
  unlockedNodes: ['n01_t0_1', 'n06_t0_1'],
  completedNodes: [],
  activeDebuff: null,
  skills: { geology: 0, tectonics: 0, biology: 0, history: 0, society: 0 }
}

export const ACTIONS = {
  COMPLETE_NODE: 'COMPLETE_NODE',
  LOAD_PERSISTED_STATE: 'LOAD_PERSISTED_STATE',
  LOSE_LIFE: 'LOSE_LIFE',
  REFILL_LIVES: 'REFILL_LIVES',
  ADD_XP: 'ADD_XP',
  ADD_GOLD: 'ADD_GOLD',
  SET_DEBUFF: 'SET_DEBUFF',
  CLEAR_DEBUFF: 'CLEAR_DEBUFF'
}

function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.COMPLETE_NODE: {
      const { nodeId, xp = 0, gold = 0, skillKey } = action.payload
      if (state.completedNodes.includes(nodeId)) return state
      const newCompleted = [...state.completedNodes, nodeId]
      const newlyUnlocked = getUnlockableNodes(newCompleted).map(n => n.nodeId)
      return {
        ...state,
        completedNodes: newCompleted,
        unlockedNodes: [...new Set([...state.unlockedNodes, ...newlyUnlocked])],
        skills: skillKey ? { ...state.skills, [skillKey]: (state.skills[skillKey] || 0) + 1 } : state.skills,
        xp: state.xp + xp, gold: state.gold + gold,
      }
    }
    case ACTIONS.REFILL_LIVES: return { ...state, lives: 5 }
    case ACTIONS.SET_DEBUFF: return { ...state, activeDebuff: action.payload }
    case ACTIONS.CLEAR_DEBUFF: return { ...state, activeDebuff: null }
    case ACTIONS.LOAD_PERSISTED_STATE: return { ...state, ...action.payload }
    case ACTIONS.LOSE_LIFE: return { ...state, lives: Math.max(0, state.lives - 1) }
    case ACTIONS.ADD_XP: return { ...state, xp: state.xp + action.payload }
    case ACTIONS.ADD_GOLD: return { ...state, gold: state.gold + action.payload }
    default: return state
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const isAdmin = session.user.email === ADMIN_EMAIL;
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) {
        dispatch({
          type: ACTIONS.LOAD_PERSISTED_STATE,
          payload: {
            isAdmin,
            xp: Number(data.xp) || 0,
            gold: Number(data.gold) || 0,
            lives: Number(data.lives) || LIVES.initial,
            skills: data.skills || INITIAL_STATE.skills,
            completedNodes: data.completed_nodes || [],
          }
        });
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await supabase.from('profiles').upsert({
          id: session.user.id,
          xp: state.xp, gold: state.gold, lives: state.lives,
          skills: state.skills, completed_nodes: state.completedNodes,
          updated_at: new Date().toISOString()
        })
      }
    }
    save();
  }, [state.xp, state.gold, state.completedNodes, state.lives]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

// ── ESTOS SON LOS QUE FALTABAN ──
export const useGame = () => {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}

export const isNodeUnlocked = (state, id) => {
  // Si eres admin, todo está desbloqueado para probar
  if (state.isAdmin) return true;
  return state.unlockedNodes?.includes(id) || false;
}

export const isNodeCompleted = (state, id) => {
  return state.completedNodes?.includes(id) || false;
}