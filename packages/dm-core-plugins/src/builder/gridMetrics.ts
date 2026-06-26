import type { TGridSize } from '../grid/types'

/** Padding (px) inside the canvas grid; mirrors `CanvasGrid` in styles.ts. */
export const CANVAS_GRID_PADDING = 4

export type TCellDelta = { columns: number; rows: number }

/**
 * Convert a pixel delta (e.g. from a dnd-kit drag or a pointer resize) into a
 * whole number of grid cells, based on the measured grid rect and its size.
 *
 * The canvas grid uses a uniform `gap` (set to `size.rowGap`) and a fixed inner
 * padding, so the stride between adjacent cell origins is
 * `(innerLength + gap) / tracks`.
 */
export const pixelDeltaToCells = (
  delta: { x: number; y: number },
  rect: { width: number; height: number },
  size: TGridSize,
  padding: number = CANVAS_GRID_PADDING
): TCellDelta => {
  const gap = Number.parseFloat(size.rowGap) || 0
  const innerWidth = rect.width - padding * 2
  const innerHeight = rect.height - padding * 2
  const strideX = (innerWidth + gap) / size.columns
  const strideY = (innerHeight + gap) / size.rows
  return {
    columns: strideX > 0 ? Math.round(delta.x / strideX) : 0,
    rows: strideY > 0 ? Math.round(delta.y / strideY) : 0,
  }
}
