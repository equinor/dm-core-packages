import { Button, Icon } from '@equinor/eds-core-react'
import { refresh } from '@equinor/eds-icons'
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

const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

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

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [remountKey, setRemountKey] = useState(0)

  if (!store || alreadyClaimed) return <>{children}</>

  const handleRefreshAll = () => {
    setIsRefreshing(true)
    store.refetchAll()
    setRemountKey((k) => k + 1)
    setTimeout(() => setIsRefreshing(false), 600)
  }

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
      <style>{spinKeyframes}</style>

      <Stack spacing={0}>
        {hasSavableEntries && (
          <Stack
            direction='row'
            justifyContent='flex-end'
            alignItems='center'
            spacing={0.5}
            padding={[0.5, 1]}
            style={{ borderBottom: '1px solid #DCDCDC' }}
          >
            <Button
              variant='ghost_icon'
              onClick={handleRefreshAll}
              disabled={isSaving}
              title='Refresh all'
            >
              <Icon
                data={refresh}
                style={
                  isRefreshing ? { animation: 'spin 0.6s linear' } : undefined
                }
              />
            </Button>
            <Button onClick={handleSaveAll} disabled={isSaving || !anyDirty}>
              {label}
            </Button>
          </Stack>
        )}
        <div key={remountKey}>{children}</div>
      </Stack>
    </SaveAnchorBoundary>
  )
}
