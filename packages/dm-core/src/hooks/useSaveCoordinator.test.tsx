import { act, renderHook } from '@testing-library/react'
import React from 'react'
import {
  createSaveCoordinatorStore,
  SaveAnchorBoundary,
  SaveCoordinatorProvider,
  useHasSaveAnchor,
  usePluginSaveRegistration,
} from './useSaveCoordinator'

describe('createSaveCoordinatorStore', () => {
  it('register() adds an entry, the returned unregister function removes it', () => {
    const store = createSaveCoordinatorStore()
    const unregister = store.register({
      id: 'a',
      idReference: 'DS/$1',
      isDirty: true,
      save: async () => {},
    })
    expect(store.getSnapshot()).toBe(true)
    unregister()
    expect(store.getSnapshot()).toBe(false)
  })

  it('getSnapshot() reflects whether ANY registered entry is dirty', () => {
    const store = createSaveCoordinatorStore()
    store.register({ id: 'a', idReference: 'DS/$1', isDirty: false })
    expect(store.getSnapshot()).toBe(false)
    store.update('a', { isDirty: true })
    expect(store.getSnapshot()).toBe(true)
  })

  it('hasSavableEntries() is only true when at least one entry provides a save fn', () => {
    const store = createSaveCoordinatorStore()
    // A read-only entry like Graph, with no save fn at all.
    store.register({ id: 'graph', idReference: 'DS/$1.items' })
    expect(store.hasSavableEntries()).toBe(false)

    store.register({
      id: 'table',
      idReference: 'DS/$1.items',
      save: async () => {},
    })
    expect(store.hasSavableEntries()).toBe(true)
  })

  describe('saveAll()', () => {
    it('calls save() only on dirty entries and excludes the given excludeId', async () => {
      const store = createSaveCoordinatorStore()
      const saveA = jest.fn().mockResolvedValue(undefined)
      const saveB = jest.fn().mockResolvedValue(undefined)
      store.register({ id: 'a', idReference: 'DS/$1.a', isDirty: true, save: saveA })
      store.register({ id: 'b', idReference: 'DS/$1.b', isDirty: false, save: saveB })

      await store.saveAll('a')

      expect(saveA).not.toHaveBeenCalled() // excluded
      expect(saveB).not.toHaveBeenCalled() // not dirty
    })

    it('sweeps in multiple passes to catch entries dirtied as a side effect of another save()', async () => {
      const store = createSaveCoordinatorStore()
      const saveB = jest.fn().mockResolvedValue(undefined)
      // Simulates a row-level Form's save() flowing into its parent Table's local
      // state, marking the Table dirty AFTER the initial dirty snapshot was taken.
      const saveA = jest.fn().mockImplementation(async () => {
        store.update('b', { isDirty: true })
      })
      store.register({ id: 'a', idReference: 'DS/$1.a', isDirty: true, save: saveA })
      store.register({ id: 'b', idReference: 'DS/$1.b', isDirty: false, save: saveB })

      await store.saveAll()

      expect(saveA).toHaveBeenCalledTimes(1)
      expect(saveB).toHaveBeenCalledTimes(1)
    })

    // NOTE: the multi-pass sweep above only catches a newly-dirtied entry if
    // whatever marks it dirty does so SYNCHRONOUSLY (e.g. a direct store.update()
    // call, as List/TablePlugin do for their row-level Form callbacks). If a side
    // effect instead only sets React state and waits for usePluginSaveRegistration's
    // own effect to push isDirty into the store, that push happens on React's
    // scheduler - which is NOT guaranteed to land before the very next pass here
    // re-checks for dirty entries, and the entry can be missed. Plugin authors
    // triggering cross-entry dirtiness from a save side effect MUST call
    // store.update(id, { isDirty: true }) synchronously rather than relying only
    // on a React state update to eventually get there.

    it('only attempts each entry once per call, even if it is still dirty afterwards', async () => {
      const store = createSaveCoordinatorStore()
      // A save() that never clears its own dirty flag (e.g. a buggy plugin).
      const save = jest.fn().mockResolvedValue(undefined)
      store.register({ id: 'a', idReference: 'DS/$1.a', isDirty: true, save })

      await store.saveAll()

      expect(save).toHaveBeenCalledTimes(1)
    })

    it('aggregates failures across entries and still attempts the others', async () => {
      const store = createSaveCoordinatorStore()
      const saveA = jest.fn().mockRejectedValue(new Error('boom'))
      const saveB = jest.fn().mockResolvedValue(undefined)
      store.register({ id: 'a', idReference: 'DS/$1.a', isDirty: true, save: saveA })
      store.register({ id: 'b', idReference: 'DS/$1.b', isDirty: true, save: saveB })

      await expect(store.saveAll()).rejects.toThrow(
        '1 nested plugin(s) failed to save'
      )
      expect(saveB).toHaveBeenCalledTimes(1)
    })

    it('warns and stops after MAX_PASSES if entries keep dirtying new entries', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const store = createSaveCoordinatorStore()
      const ids = Array.from({ length: 12 }, (_, i) => `e${i}`)
      ids.forEach((id, index) => {
        const nextId = ids[index + 1]
        store.register({
          id,
          idReference: `DS/$1.${id}`,
          isDirty: index === 0,
          save: jest.fn().mockImplementation(async () => {
            if (nextId) store.update(nextId, { isDirty: true })
          }),
        })
      })

      await store.saveAll()

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('max pass limit')
      )
      warnSpy.mockRestore()
    })
  })

  describe('notifyChanged()', () => {
    it('calls refetch on entries with the exact same idReference', () => {
      const store = createSaveCoordinatorStore()
      const refetch = jest.fn()
      store.register({ id: 'a', idReference: 'DS/$1', save: async () => {} })
      store.register({ id: 'b', idReference: 'DS/$1', refetch })

      store.notifyChanged('DS/$1', 'a')

      expect(refetch).toHaveBeenCalledTimes(1)
    })

    it('calls refetch on entries whose address is a nested attribute/array-item', () => {
      const store = createSaveCoordinatorStore()
      const refetchDotted = jest.fn()
      const refetchBracketed = jest.fn()
      store.register({ id: 'table', idReference: 'DS/$1.items', save: async () => {} })
      store.register({ id: 'form', idReference: 'DS/$1', refetch: refetchDotted })
      store.register({ id: 'row', idReference: 'DS/$1.items[0]', refetch: refetchBracketed })

      store.notifyChanged('DS/$1.items', 'table')

      expect(refetchDotted).toHaveBeenCalledTimes(1)
      expect(refetchBracketed).toHaveBeenCalledTimes(1)
    })

    it('does not notify the source entry itself, or unrelated addresses', () => {
      const store = createSaveCoordinatorStore()
      const sourceRefetch = jest.fn()
      const unrelatedRefetch = jest.fn()
      store.register({ id: 'a', idReference: 'DS/$1.items', refetch: sourceRefetch })
      store.register({ id: 'b', idReference: 'DS/$1.other', refetch: unrelatedRefetch })

      store.notifyChanged('DS/$1.items', 'a')

      expect(sourceRefetch).not.toHaveBeenCalled()
      expect(unrelatedRefetch).not.toHaveBeenCalled()
    })

    it('does not false-positive on similar-looking prefixes without a real path delimiter', () => {
      const store = createSaveCoordinatorStore()
      const refetch = jest.fn()
      // "items" is a plain string-prefix of "itemsExtra", but NOT a real
      // ancestor/descendant address relationship - must not match.
      store.register({ id: 'a', idReference: 'DS/$1.itemsExtra', refetch })

      store.notifyChanged('DS/$1.items', 'source')

      expect(refetch).not.toHaveBeenCalled()
    })
  })
})

describe('usePluginSaveRegistration', () => {
  it('no-ops safely when there is no ancestor SaveCoordinator (standalone use)', () => {
    const { result } = renderHook(() =>
      usePluginSaveRegistration({
        id: 'a',
        idReference: 'DS/$1',
        isDirty: true,
        save: async () => {},
      })
    )

    expect(result.current.isCoordinated).toBe(false)
    expect(result.current.anyDirty).toBe(false)
    expect(result.current.hasAnchorAbove).toBe(false)
    // Should resolve without throwing even though nothing is listening.
    return expect(result.current.saveAll()).resolves.toBeUndefined()
  })

  it('registers with the nearest coordinator and reflects anyDirty', () => {
    const store = createSaveCoordinatorStore()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SaveCoordinatorProvider value={store}>{children}</SaveCoordinatorProvider>
    )

    const { result, rerender } = renderHook(
      ({ isDirty }) =>
        usePluginSaveRegistration({ id: 'a', idReference: 'DS/$1', isDirty }),
      { wrapper, initialProps: { isDirty: false } }
    )

    expect(result.current.isCoordinated).toBe(true)
    expect(result.current.anyDirty).toBe(false)

    act(() => rerender({ isDirty: true }))

    expect(result.current.anyDirty).toBe(true)
  })

  it('hasAnchorAbove reflects whether an ancestor SaveAnchorBoundary claimed this subtree', () => {
    const noBoundary = renderHook(() => useHasSaveAnchor())
    expect(noBoundary.result.current).toBe(false)

    const withBoundary = renderHook(() => useHasSaveAnchor(), {
      wrapper: ({ children }) => <SaveAnchorBoundary>{children}</SaveAnchorBoundary>,
    })
    expect(withBoundary.result.current).toBe(true)
  })
})
