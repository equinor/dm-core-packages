import {
  breakHistory,
  canRedo,
  canUndo,
  createHistory,
  HISTORY_LIMIT,
  pushHistory,
  redoHistory,
  undoHistory,
} from '../history'

describe('builder history', () => {
  it('creates history with the initial present value and empty stacks', () => {
    const present = { id: 'initial' }
    const history = createHistory(present)

    expect(history).toEqual({
      past: [],
      present,
      future: [],
      lastLabel: null,
    })
    expect(canUndo(history)).toBe(false)
    expect(canRedo(history)).toBe(false)
  })

  it('pushes the current present onto past, updates present, and clears future', () => {
    const initial = createHistory('A')
    const withFuture = undoHistory(pushHistory(pushHistory(initial, 'B'), 'C'))
    const result = pushHistory(withFuture, 'D')

    expect(result).toEqual({
      past: ['A', 'B'],
      present: 'D',
      future: [],
      lastLabel: null,
    })
    expect(canUndo(result)).toBe(true)
    expect(canRedo(result)).toBe(false)
  })

  it('does nothing when pushing the same present reference', () => {
    const present = { id: 'same' }
    const history = createHistory(present)

    expect(pushHistory(history, present, 'edit')).toBe(history)
  })

  it('trims past entries to the history limit and drops the oldest entries', () => {
    let history = createHistory(0)
    for (let next = 1; next <= HISTORY_LIMIT + 5; next++) {
      history = pushHistory(history, next)
    }

    expect(history.past).toHaveLength(HISTORY_LIMIT)
    expect(history.past[0]).toBe(5)
    expect(history.past[history.past.length - 1]).toBe(HISTORY_LIMIT + 4)
    expect(history.present).toBe(HISTORY_LIMIT + 5)
  })

  it('coalesces consecutive non-null labels by replacing present without growing past', () => {
    const first = pushHistory(createHistory('A'), 'B', 'drag')
    const coalesced = pushHistory(first, 'C', 'drag')
    const differentLabel = pushHistory(coalesced, 'D', 'resize')
    const nullLabel = pushHistory(differentLabel, 'E')

    expect(first.past).toEqual(['A'])
    expect(coalesced.past).toEqual(['A'])
    expect(coalesced.present).toBe('C')
    expect(differentLabel.past).toEqual(['A', 'C'])
    expect(differentLabel.present).toBe('D')
    expect(nullLabel.past).toEqual(['A', 'C', 'D'])
    expect(nullLabel.present).toBe('E')
  })

  it('moves present through past and future for undo and redo', () => {
    const history = pushHistory(pushHistory(createHistory('A'), 'B'), 'C')

    const firstUndo = undoHistory(history)
    expect(firstUndo).toEqual({
      past: ['A'],
      present: 'B',
      future: ['C'],
      lastLabel: null,
    })

    const secondUndo = undoHistory(firstUndo)
    expect(secondUndo).toEqual({
      past: [],
      present: 'A',
      future: ['B', 'C'],
      lastLabel: null,
    })
    expect(undoHistory(secondUndo)).toBe(secondUndo)

    const firstRedo = redoHistory(secondUndo)
    expect(firstRedo).toEqual({
      past: ['A'],
      present: 'B',
      future: ['C'],
      lastLabel: null,
    })

    const secondRedo = redoHistory(firstRedo)
    expect(secondRedo.present).toBe('C')
    expect(secondRedo.future).toEqual([])
    expect(redoHistory(secondRedo)).toBe(secondRedo)
  })

  it('clears future when pushing a fresh value after undo', () => {
    const history = pushHistory(pushHistory(createHistory('A'), 'B'), 'C')
    const undone = undoHistory(history)
    const result = pushHistory(undone, 'D')

    expect(result).toEqual({
      past: ['A', 'B'],
      present: 'D',
      future: [],
      lastLabel: null,
    })
  })

  it('breaks a coalescing run so the next same-label push creates a new step', () => {
    const first = pushHistory(createHistory('A'), 'B', 'typing')
    const broken = breakHistory(first)
    const result = pushHistory(broken, 'C', 'typing')

    expect(broken.lastLabel).toBeNull()
    expect(result.past).toEqual(['A', 'B'])
    expect(result.present).toBe('C')
    expect(result.lastLabel).toBe('typing')
  })
})
