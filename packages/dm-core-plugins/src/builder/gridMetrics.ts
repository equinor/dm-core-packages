import type { TGridSize } from '../grid'

/** Padding (px) inside the canvas grid; mirrors `CanvasGrid` in styles.ts. */
export const CANVAS_GRID_PADDING = 4

export type TCellDelta = { columns: number; rows: number }

/**
 * Convert a pixel delta (e.g. from a dnd-kit drag or a pointer resize) into a
 * whole number of grid cells, based on the measured grid rect and its size.
 *
 * The canvas grid uses equal `1fr` tracks with a fixed inner padding and a
 * per-axis gap (`columnGap` horizontally, `rowGap` vertically), so the stride
 * between adjacent cell origins is `(innerLength + gap) / tracks`.
 *
 * Note: gaps are assumed to be px values; non-px CSS units cannot be resolved
 * from the model alone and fall back to 0.
 */
export const pixelDeltaToCells = (
  delta: { x: number; y: number },
  rect: { width: number; height: number },
  size: TGridSize,
  padding: number = CANVAS_GRID_PADDING
): TCellDelta => {
  const gapX = Number.parseFloat(size.columnGap) || 0
  const gapY = Number.parseFloat(size.rowGap) || 0
  const innerWidth = rect.width - padding * 2
  const innerHeight = rect.height - padding * 2
  const strideX = (innerWidth + gapX) / size.columns
  const strideY = (innerHeight + gapY) / size.rows
  const roundDelta = (value: number, stride: number): number => {
    if (stride <= 0) return 0
    const rounded = Math.round(value / stride)
    return Object.is(rounded, -0) ? 0 : rounded
  }
  return {
    columns: roundDelta(delta.x, strideX),
    rows: roundDelta(delta.y, strideY),
  }
}
