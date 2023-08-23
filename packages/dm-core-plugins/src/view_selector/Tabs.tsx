import { Button, Tabs as EdsTabs, Tooltip } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import * as React from 'react'
import Icon from './Icon'
import { TItemData } from './types'

export const Tabs = (props: {
  selectedView: string
  setSelectedView: (viewId: string) => void
  items: TItemData[]
  removeView: (viewId: string) => void
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props
  return (
    <EdsTabs activeTab={items.findIndex((x) => x.viewId == selectedView)}>
      <EdsTabs.List>
        {items.map((config: TItemData) => {
          return (
            <EdsTabs.Tab
              key={config.viewId}
              as="div"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                padding: 0,
              }}
            >
              <Button
                onClick={() => setSelectedView(config.viewId)}
                variant="ghost"
                style={{ fontSize: '16px' }}
              >
                {config.view?.eds_icon && (
                  <Icon
                    name={config.view.eds_icon}
                    title={config.view.eds_icon}
                  />
                )}
                {config.label}
              </Button>
              {config.closeable && (
                <Tooltip title={`Close ${config.label}`}>
                  <Button
                    aria-label={`Close ${config.label}`}
                    onClick={() => props.removeView(config.viewId)}
                    variant="ghost_icon"
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
