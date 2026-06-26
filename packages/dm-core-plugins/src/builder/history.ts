import { useCallback, useMemo, useState } from 'react'

/**
 * An undo/redo history of immutable snapshots.
 *
 * `present` is the current value; `past`/`future` are the stacks stepped through
 * by undo/redo. `lastLabel` tracks the label of the most recent change so that
 * consecutive changes sharing a label (e.g. dragging a resize handle, or typing
 * into one field) coalesce into a single undo step instead of dozens.
 */
export type THistory<T> = {
  past: T[]
  present: T
  future: T[]
  lastLabel: string | null
}

/** Maximum number of undo steps kept; older steps are discarded. */
export const HISTORY_LIMIT = 100

export const createHistory = <T>(present: T): THistory<T> => ({
  past: [],
  present,
  future: [],
  lastLabel: null,
})

export const canUndo = <T>(history: THistory<T>): boolean =>
  history.past.length > 0

export const canRedo = <T>(history: THistory<T>): boolean =>
  history.future.length > 0

/**
 * Record a new present value.
 *
 * - No-op when `next` is identical to the current present.
 * - When `label` is non-null and equals the previous change's label, the present
 *   is replaced in place (the change coalesces, no new undo step is created).
 * - Otherwise the current present is pushed onto the past, `future` is cleared,
 *   and the past is trimmed to `limit` entries.
 */
export const pushHistory = <T>(
  history: THistory<T>,
  next: T,
  label: string | null = null,
  limit: number = HISTORY_LIMIT
): THistory<T> => {
  if (next === history.present) return history

  if (label !== null && label === history.lastLabel) {
    return { ...history, present: next }
  }

  const past = [...history.past, history.present]
  return {
    past: past.length > limit ? past.slice(past.length - limit) : past,
    present: next,
    future: [],
    lastLabel: label,
  }
}

export const undoHistory = <T>(history: THistory<T>): THistory<T> => {
  if (!canUndo(history)) return history
  const previous = history.past[history.past.length - 1]
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
    lastLabel: null,
  }
}

export const redoHistory = <T>(history: THistory<T>): THistory<T> => {
  if (!canRedo(history)) return history
  const next = history.future[0]
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
    lastLabel: null,
  }
}

/** End any coalescing run so the next change always starts a new undo step. */
export const breakHistory = <T>(history: THistory<T>): THistory<T> =>
  history.lastLabel === null ? history : { ...history, lastLabel: null }

export type TUseHistory<T> = {
  present: T
  canUndo: boolean
  canRedo: boolean
  /** Record a change. Pass a `label` to coalesce consecutive related changes. */
  set: (updater: T | ((current: T) => T), label?: string | null) => void
  undo: () => void
  redo: () => void
  /** Replace the whole history with a fresh baseline (no undo across it). */
  reset: (value: T) => void
  /** End the current coalescing run (e.g. on pointer-up or blur). */
  commit: () => void
}

/** React state hook backed by an undo/redo history. */
export const useHistory = <T>(initial: T | (() => T)): TUseHistory<T> => {
  const [history, setHistory] = useState<THistory<T>>(() =>
    createHistory(
      typeof initial === 'function' ? (initial as () => T)() : initial
    )
  )

  const set = useCallback(
    (updater: T | ((current: T) => T), label: string | null = null) =>
      setHistory((current) =>
        pushHistory(
          current,
          typeof updater === 'function'
            ? (updater as (value: T) => T)(current.present)
            : updater,
          label
        )
      ),
    []
  )

  const undo = useCallback(() => setHistory(undoHistory), [])
  const redo = useCallback(() => setHistory(redoHistory), [])
  const reset = useCallback((value: T) => setHistory(createHistory(value)), [])
  const commit = useCallback(() => setHistory(breakHistory), [])

  return useMemo(
    () => ({
      present: history.present,
      canUndo: canUndo(history),
      canRedo: canRedo(history),
      set,
      undo,
      redo,
      reset,
      commit,
    }),
    [history, set, undo, redo, reset, commit]
  )
}
