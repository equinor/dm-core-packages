import { Button } from '@equinor/eds-core-react'
import { useState, useSyncExternalStore } from 'react'
import {
  SaveAnchorBoundary,
  useHasSaveAnchor,
  useSaveCoordinatorStore,
} from '../hooks/useSaveCoordinator'
import { Stack } from '../layout'

type Props = {
  children: React.ReactNode
  label?: string
}

/**
 * Ready-made "claim the save anchor for this subtree" component. Container plugins
 * (Stack, Grid, ...) that have no save UI of their own can wrap their rendered
 * children in this to get a single shared "Save all" button - any nested plugin
 * (e.g. a Table) will automatically detect the anchor and defer its own saving to it.
 *
 * Renders children unchanged (no button, no new boundary) if there's no coordinator
 * at all, or if an ancestor has already claimed the anchor - so nesting these is safe.
 * Also renders no button (while still claiming the anchor) if nothing in this
 * subtree is even capable of being saved (e.g. a Stack of read-only plugins) -
 * avoids showing a permanently-disabled button with nothing to do.
 *
 * @docs Components
 */
export function SaveCoordinatorAnchor({
  children,
  label = 'Save all changes',
}: Props) {
  const store = useSaveCoordinatorStore()
  const alreadyClaimed = useHasSaveAnchor()
  const [isSaving, setIsSaving] = useState(false)
  const anyDirty = useSyncExternalStore(
    store?.subscribe ?? (() => () => {}),
    store?.getSnapshot ?? (() => false)
  )
  const hasSavableEntries = useSyncExternalStore(
    store?.subscribe ?? (() => () => {}),
    store?.hasSavableEntries ?? (() => false)
  )

  if (!store || alreadyClaimed) return <>{children}</>

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      await store.saveAll()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SaveAnchorBoundary>
      <Stack spacing={1}>
        {hasSavableEntries && (
          <Stack direction='row' justifyContent='flex-end'>
            <Button onClick={handleSaveAll} disabled={isSaving || !anyDirty}>
              {label}
            </Button>
          </Stack>
        )}
        {children}
      </Stack>
    </SaveAnchorBoundary>
  )
}
