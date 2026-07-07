import { type DmssAPI, splitAddress } from '@development-framework/dm-core'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  deserializeSite,
  isSerializedSite,
  resolvePluginAliases,
  serializeSite,
  type TBuilderSite,
} from '../model/site'

export type TSaveState = 'saved' | 'saving' | 'dirty'

type UsePersistenceArgs = {
  site: TBuilderSite
  document: Record<string, unknown> | null | undefined
  idReference: string | undefined
  dmssAPI: DmssAPI
  locked: boolean
  onChange?: (value: unknown) => void
  notify: (message: string) => void
  setSite: (
    updater: (current: TBuilderSite) => TBuilderSite,
    label?: string | null
  ) => void
  /** Called once when a saved site is hydrated, so the editor can reset its
   * page/section/selection to the loaded document. */
  onSiteLoaded: (site: TBuilderSite) => void
}

type UsePersistenceResult = {
  saveState: TSaveState
  saveStatusLabel: string
  save: () => Promise<boolean>
}

/**
 * Owns loading and saving the site: initial hydration from the bound entity,
 * the autosave debounce, the manual save, and the unsaved-changes guard.
 *
 * Builder widgets serialize free-form inline `config` objects with no DMSS
 * `type`, which the validating update endpoint rejects. We therefore write
 * through the context-free add-raw endpoint (the same path used to create a
 * site), which stores the document verbatim and upserts by `_id`.
 */
export const usePersistence = ({
  site,
  document,
  idReference,
  dmssAPI,
  locked,
  onChange,
  notify,
  setSite,
  onSiteLoaded,
}: UsePersistenceArgs): UsePersistenceResult => {
  // Persisted JSON of the whole site (all pages). The baseline ref tracks what
  // was last saved so we can tell whether there are unsaved changes.
  const currentJson = useMemo(() => JSON.stringify(serializeSite(site)), [site])
  const savedJsonRef = useRef(currentJson)
  const [saveState, setSaveState] = useState<TSaveState>('saved')

  // Hydrate the builder from the page entity's saved `layout` once it loads, so
  // reopening shows previously saved work rather than the recipe seed. Accepts
  // both the multi-page site format and a legacy single-grid layout. A corrupt
  // or unreadable layout must never crash the editor: on failure we keep the
  // seeded/empty site and tell the user, so their next save can recover it.
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (hydratedRef.current) return
    // A Site-shaped document (top-level `pages`) *is* the site; otherwise the
    // site is embedded in the host document's `layout` attribute (a page/host
    // entity). Detecting by shape keeps existing `.layout` hosts unchanged.
    const source = isSerializedSite(document) ? document : document?.layout
    if (!source) return
    hydratedRef.current = true
    try {
      const loaded = deserializeSite(source)
      if (loaded.pages.length === 0) {
        throw new Error('Saved layout has no pages')
      }
      savedJsonRef.current = JSON.stringify(serializeSite(loaded))
      setSite(() => loaded, 'load')
      onSiteLoaded(loaded)
      setSaveState('saved')
    } catch {
      // Leave the current (seeded) site in place and flag it as unsaved so the
      // author can review before overwriting whatever unreadable data existed.
      setSaveState('dirty')
      notify('Could not read the saved page — starting from a blank layout')
    }
  }, [document, setSite, notify, onSiteLoaded])

  /**
   * Persist the current site. When the bound document *is* the site
   * (Site-shaped) we write the navbar/pages onto the document itself with
   * fully-qualified addresses (aliases can't be resolved on read), preserving
   * the document's own `_id`, `type` and metadata. Otherwise the site is stored
   * in the host document's `layout` attribute. Without an entity we fall back to
   * the host `onChange` handler. Returns true on success.
   */
  const save = async (): Promise<boolean> => {
    const serializedSite = JSON.parse(currentJson)
    setSaveState('saving')
    try {
      if (idReference && document) {
        const { dataSource } = splitAddress(idReference)
        const body = isSerializedSite(document)
          ? {
              ...document,
              ...resolvePluginAliases(serializedSite),
              type: document.type,
            }
          : { ...document, layout: resolvePluginAliases(serializedSite) }
        await dmssAPI.documentAddSimple({ dataSourceId: dataSource, body })
      } else if (onChange) {
        onChange(serializedSite)
      } else {
        setSaveState('dirty')
        return false
      }
      savedJsonRef.current = currentJson
      setSaveState('saved')
      return true
    } catch {
      setSaveState('dirty')
      notify('Could not save page')
      return false
    }
  }

  // Autosave: debounce changes and persist them. Without a save target the page
  // just stays marked as having unsaved changes.
  useEffect(() => {
    if (locked) return
    if (currentJson === savedJsonRef.current) {
      setSaveState('saved')
      return
    }
    if (!idReference && !onChange) {
      setSaveState('dirty')
      return
    }
    setSaveState('saving')
    const timer = setTimeout(() => {
      void save()
    }, 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJson, onChange, idReference, document])

  // Warn before leaving the page while there are unsaved changes.
  useEffect(() => {
    if (locked) return
    if (saveState === 'saved') return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveState, locked])

  const saveStatusLabel =
    saveState === 'saved'
      ? 'All changes saved'
      : saveState === 'saving'
        ? 'Saving…'
        : 'Unsaved changes'

  return { saveState, saveStatusLabel, save }
}
