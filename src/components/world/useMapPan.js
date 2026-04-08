/**
 * useMapPan.js — Lógica de panning del mapa mundial.
 *
 * Responsabilidades:
 *   - Arrastrar el mapa con mouse y touch
 *   - Clampear el offset para no mostrar espacio vacío fuera del mundo
 *   - centerOn(wx, wy): centrar el viewport en coordenadas del mundo con animación CSS
 *   - Exponer `hasDragged` para que los hijos distingan click vs drag
 */

import { useState, useRef, useCallback } from 'react'
import { CANVAS } from '../../constants/gameConfig.js'

const { width: WORLD_W, height: WORLD_H, viewportWidth: VP_W, viewportHeight: VP_H } = CANVAS

const DRAG_THRESHOLD = 6  // px de movimiento para considerar drag (no click)

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function clampOffset(x, y) {
  return {
    x: clamp(x, VP_W - WORLD_W, 0),   // [-1500, 0]
    y: clamp(y, VP_H - WORLD_H, 0),   // [-1300, 0]
  }
}

/** Calcula el offset para centrar el viewport en (wx, wy) */
function offsetForCenter(wx, wy) {
  return clampOffset(VP_W / 2 - wx, VP_H / 2 - wy)
}

export function useMapPan(initialIsland = { canvasX: 300, canvasY: 400 }) {
  const init = offsetForCenter(initialIsland.canvasX, initialIsland.canvasY)

  const [offset,      setOffset]      = useState(init)
  const [isDragging,  setIsDragging]  = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)  // CSS transition activo

  // Refs para valores de drag — no necesitan re-render
  const dragOrigin  = useRef(null)    // {clientX, clientY} en mouseDown
  const offsetStart = useRef(init)    // offset al inicio del drag
  const hasDragged  = useRef(false)   // true si movió más de DRAG_THRESHOLD

  // ── centerOn: mueve el viewport hacia coordenadas del mundo ─────────────
  const centerOn = useCallback((wx, wy) => {
    setIsAnimating(true)
    setOffset(offsetForCenter(wx, wy))
    // Quitar la transición al terminar para no afectar el drag siguiente
    const tid = setTimeout(() => setIsAnimating(false), 420)
    return () => clearTimeout(tid)
  }, [])

  // ── Handlers de Mouse ────────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return    // solo botón izquierdo
    e.preventDefault()
    hasDragged.current  = false
    dragOrigin.current  = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }  // snapshot del offset actual
    setIsDragging(true)
    setIsAnimating(false)
  }, [offset])

  const onMouseMove = useCallback((e) => {
    if (!isDragging || !dragOrigin.current) return
    const dx = e.clientX - dragOrigin.current.x
    const dy = e.clientY - dragOrigin.current.y
    if (!hasDragged.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      hasDragged.current = true
    }
    if (hasDragged.current) {
      setOffset(clampOffset(
        offsetStart.current.x + dx,
        offsetStart.current.y + dy,
      ))
    }
  }, [isDragging])

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
    dragOrigin.current = null
  }, [])

  // ── Handlers de Touch ────────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    const t = e.touches[0]
    hasDragged.current  = false
    dragOrigin.current  = { x: t.clientX, y: t.clientY }
    offsetStart.current = { ...offset }
    setIsDragging(true)
    setIsAnimating(false)
  }, [offset])

  const onTouchMove = useCallback((e) => {
    if (!isDragging || !dragOrigin.current) return
    const t = e.touches[0]
    const dx = t.clientX - dragOrigin.current.x
    const dy = t.clientY - dragOrigin.current.y
    if (!hasDragged.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      hasDragged.current = true
    }
    if (hasDragged.current) {
      setOffset(clampOffset(
        offsetStart.current.x + dx,
        offsetStart.current.y + dy,
      ))
    }
  }, [isDragging])

  const onTouchEnd = useCallback(() => {
    setIsDragging(false)
    dragOrigin.current = null
  }, [])

  return {
    offset,
    isDragging,
    isAnimating,
    hasDragged,        // ref — leer con hasDragged.current en handlers de hijos
    centerOn,
    panHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  }
}
