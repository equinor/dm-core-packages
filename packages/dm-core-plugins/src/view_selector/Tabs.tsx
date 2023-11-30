import { Button, Tabs as EdsTabs, Tooltip } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import * as React from 'react'
import Icon from './Icon'
import { TItemData } from './types'

export const Tabs = (props: {
  selectedViewId: string
  setSelectedViewId: (viewId: string) => void
  viewSelectorItems: TItemData[]
  removeView: (viewId: string) => void
}): React.ReactElement => {
  const { selectedViewId, setSelectedViewId, viewSelectorItems } = props
  return (
    <EdsTabs
      activeTab={viewSelectorItems.findIndex((x) => x.viewId == selectedViewId)}
    >
      <EdsTabs.List>
        {viewSelectorItems.map((config: TItemData) => {
          return (
            <EdsTabs.Tab
              key={config.viewId}
              as='div'
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                padding: 0,
              }}
            >
              <Button
                onClick={() => setSelectedViewId(config.viewId)}
                variant='ghost'
                style={{ fontSize: '16px' }}
              >
                {config.viewConfig?.eds_icon && (
                  <Icon
                    name={config.viewConfig.eds_icon}
                    title={config.viewConfig.eds_icon}
                  />
                )}
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
