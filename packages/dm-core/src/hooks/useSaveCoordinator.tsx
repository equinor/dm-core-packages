import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react'

// One entry per plugin instance that opts in to coordinated save/refresh.
export type TCoordinatorEntry = {
  id: string
  idReference: string
  isDirty?: boolean
  save?: () => Promise<void>
  refetch?: () => void
}

export interface ISaveCoordinatorStore {
  register: (entry: TCoordinatorEntry) => () => void
  update: (id: string, patch: Partial<TCoordinatorEntry>) => void
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => boolean
  hasSavableEntries: () => boolean
  saveAll: (excludeId?: string) => Promise<void>
  notifyChanged: (idReference: string, sourceId: string) => void
}

// Two addresses are "related" if identical, or one is a nested attribute/array-item of the other.
function isRelatedAddress(a: string, b: string): boolean {
  return (
    a === b ||
    a.startsWith(`${b}.`) ||
    a.startsWith(`${b}[`) ||
    a.startsWith(`${b}(`) ||
    b.startsWith(`${a}.`) ||
    b.startsWith(`${a}[`) ||
    b.startsWith(`${a}(`)
  )
}

// Plain pub/sub store (not React state), so registering/updating entries never
// re-renders the whole plugin tree - only components using useSyncExternalStore do.
export function createSaveCoordinatorStore(): ISaveCoordinatorStore {
  const entries = new Map<string, TCoordinatorEntry>()
  const listeners = new Set<() => void>()
  const emit = () => listeners.forEach((listener) => listener())

  return {
    register(entry) {
      entries.set(entry.id, entry)
      emit()
      return () => {
        entries.delete(entry.id)
        emit()
      }
    },
    update(id, patch) {
      const current = entries.get(id)
      if (!current) return
      entries.set(id, { ...current, ...patch })
      emit()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => [...entries.values()].some((entry) => entry.isDirty),
    hasSavableEntries: () =>
      [...entries.values()].some((entry) => entry.save !== undefined),
    async saveAll(excludeId) {
      const MAX_PASSES = 10
      const attempted = new Set<string>()
      const failures: unknown[] = []

      for (let pass = 0; pass < MAX_PASSES; pass++) {
        const dirty = [...entries.values()].filter(
          (entry) =>
            entry.id !== excludeId &&
            !attempted.has(entry.id) &&
            entry.isDirty &&
            entry.save
        )
        if (dirty.length === 0) break
        dirty.forEach((entry) => attempted.add(entry.id))
        const results = await Promise.allSettled(
          dirty.map((entry) => entry.save!())
        )
        results.forEach((result) => {
          if (result.status === 'rejected') failures.push(result.reason)
        })
        if (pass === MAX_PASSES - 1) {
          console.warn(
            'SaveCoordinator: saveAll() hit its max pass limit - some entries may keep reporting dirty after saving.'
          )
        }
      }

      if (failures.length) {
        throw new Error(`${failures.length} nested plugin(s) failed to save`)
      }
    },
    notifyChanged(idReference, sourceId) {
      entries.forEach((entry) => {
        if (
          entry.id !== sourceId &&
          isRelatedAddress(entry.idReference, idReference)
        ) {
          entry.refetch?.()
        }
      })
    },
  }
}

const SaveCoordinatorContext = createContext<ISaveCoordinatorStore | null>(null)
export const SaveCoordinatorProvider = SaveCoordinatorContext.Provider

// Raw store access for advanced consumers (e.g. the SaveCoordinatorAnchor component).
export const useSaveCoordinatorStore = () => useContext(SaveCoordinatorContext)

// Whether an ancestor has already claimed responsibility for saving/refreshing this
// subtree. Plain React context (not the store) - claims are rare/static compared to
// dirty-state churn, so a normal re-render on claim is fine; no need for the
// re-render-avoiding useSyncExternalStore machinery used for entries.
const SaveAnchorContext = createContext(false)
export const useHasSaveAnchor = () => useContext(SaveAnchorContext)

// Marks this subtree as "already has an owner for saving" - nested plugins that check
// useHasSaveAnchor()/usePluginSaveRegistration().hasAnchorAbove should defer to it
// instead of showing their own save controls. Re-wrapping when one already exists
// above is harmless (the value just stays true).
export function SaveAnchorBoundary({ children }: { children: ReactNode }) {
  return (
    <SaveAnchorContext.Provider value={true}>
      {children}
    </SaveAnchorContext.Provider>
  )
}

// Reuses an ancestor coordinator if one is already provided, otherwise lazily
// creates a new one. Used by EntityView so a whole rendered tree shares one store.
export function useSaveCoordinatorValue(): ISaveCoordinatorStore {
  const existing = useContext(SaveCoordinatorContext)
  const createdRef = useRef<ISaveCoordinatorStore | null>(null)
  if (!existing && !createdRef.current)
    createdRef.current = createSaveCoordinatorStore()
  return existing ?? createdRef.current!
}

/**
 * Registers a plugin instance with the nearest SaveCoordinator, if any.
 * No-ops (safe defaults) when there is no ancestor coordinator, e.g. when a
 * plugin is used standalone - preserving today's behavior automatically.
 *
 * @docs Hooks
 */
export function usePluginSaveRegistration(entry: TCoordinatorEntry) {
  const store = useContext(SaveCoordinatorContext)
  const hasAnchorAbove = useHasSaveAnchor()
  const latest = useRef(entry)
  latest.current = entry

  useEffect(() => {
    if (!store) return
    return store.register({
      id: latest.current.id,
      idReference: latest.current.idReference,
      isDirty: latest.current.isDirty,
      // Preserve "no real save/refetch provided" (e.g. a read-only Graph) rather than
      // always wrapping in a function, so hasSavableEntries() reflects it accurately.
      save: latest.current.save ? () => latest.current.save!() : undefined,
      refetch: latest.current.refetch
        ? () => latest.current.refetch!()
        : undefined,
    })
    // Only re-register if identity/address changes; dirty state is pushed separately below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, entry.id, entry.idReference])

  useEffect(() => {
    store?.update(entry.id, { isDirty: entry.isDirty })
  }, [store, entry.id, entry.isDirty])

  const anyDirty = useSyncExternalStore(
    store?.subscribe ?? (() => () => {}),
    store?.getSnapshot ?? (() => false)
  )

  return {
    isCoordinated: !!store,
    anyDirty,
    // Whether an ancestor already owns saving for this subtree - use this (not tree
    // position) to decide whether to hide your own save controls / defer writes.
    hasAnchorAbove,
    // Excludes this entry itself by default, so flushing nested plugins after your own
    // successful save can't re-trigger your own save() again.
    saveAll: (excludeSelf: boolean = true) =>
      store?.saveAll(excludeSelf ? entry.id : undefined) ?? Promise.resolve(),
    notifyChanged: () => store?.notifyChanged(entry.idReference, entry.id),
  }
}
