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

export const useSaveCoordinatorStore = () => useContext(SaveCoordinatorContext)

const SaveAnchorContext = createContext(false)
export const useHasSaveAnchor = () => useContext(SaveAnchorContext)

export function SaveAnchorBoundary({ children }: { children: ReactNode }) {
  return (
    <SaveAnchorContext.Provider value={true}>
      {children}
    </SaveAnchorContext.Provider>
  )
}

export function useSaveCoordinatorValue(): ISaveCoordinatorStore {
  const existing = useContext(SaveCoordinatorContext)
  const createdRef = useRef<ISaveCoordinatorStore | null>(null)
  if (!existing && !createdRef.current)
    createdRef.current = createSaveCoordinatorStore()
  return existing ?? createdRef.current!
}

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
      save: latest.current.save ? () => latest.current.save!() : undefined,
      refetch: latest.current.refetch
        ? () => latest.current.refetch!()
        : undefined,
    })
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
    hasAnchorAbove,
    saveAll: (excludeSelf: boolean = true) =>
      store?.saveAll(excludeSelf ? entry.id : undefined) ?? Promise.resolve(),
    notifyChanged: () => store?.notifyChanged(entry.idReference, entry.id),
  }
}
