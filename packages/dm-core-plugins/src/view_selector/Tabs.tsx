import { Button, Tabs as EdsTabs, Tooltip } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import Icon from './Icon'
import type { TItemData } from './types'

export const Tabs = (props: {
  selectedViewId: string
  setSelectedViewId: (viewId: string) => void
  viewSelectorItems: TItemData[]
  removeView: (viewId: string) => void
}): React.ReactElement => {
  const { selectedViewId, setSelectedViewId, viewSelectorItems } = props

  return (
    <EdsTabs
      activeTab={viewSelectorItems.findIndex(
        (x) => x.viewId === selectedViewId
      )}
      scrollable
    >
      <EdsTabs.List>
        {viewSelectorItems.map((config: TItemData) => {
          const icon = config.eds_icon || config.viewConfig?.eds_icon
          return (
            <EdsTabs.Tab
              key={config.viewId}
              as='div'
              style={{ padding: 0, overflow: 'hidden', flexDirection: 'row' }}
            >
              <Button
                onClick={() => {
                  if (config.viewConfig) {
                    setSelectedViewId(config.viewId)
                  }
                }}
                variant='ghost'
                style={{ fontSize: '1rem' }}
              >
                {icon && <Icon name={icon} title={icon} />}
                {config.label}
              </Button>
              {config.closeable && (
                <Tooltip title={`Close ${config.label}`}>
                  <Button
                    aria-label={`Close ${config.label}`}
                    onClick={() => props.removeView(config.viewId)}
                    variant='ghost_icon'
                  >
                    <Icon size={16} data={close} />
                  </Button>
                </Tooltip>
              )}
            </EdsTabs.Tab>
          )
        })}
      </EdsTabs.List>
    </EdsTabs>
  )
}
