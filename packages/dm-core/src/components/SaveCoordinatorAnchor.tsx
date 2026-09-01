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
