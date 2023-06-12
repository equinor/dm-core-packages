import * as React from 'react'
import { Tabs as EdsTabs, Tooltip } from '@equinor/eds-core-react'
import { TItemData } from './types'
import Icon from './Icon'
import { close } from '@equinor/eds-icons'

export const Tabs = (props: {
  selectedView: string
  setSelectedView: (viewId: string) => void
  items: TItemData[]
  removeView: (viewId: string) => void
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props
  return (
    <EdsTabs>
      <EdsTabs.List>
        {items.map((config: TItemData) => {
          return (
            <>
              <EdsTabs.Tab
                key={config.viewId}
                onClick={() => setSelectedView(config.viewId)}
                active={selectedView === config.viewId}
              >
                {config.view.eds_icon && (
                  <Icon
                    style={{ paddingRight: '4px' }}
                    name={config.view.eds_icon}
                    title={config.view.eds_icon}
                  />
                )}
                {config.label}
              </EdsTabs.Tab>
              {config.closeable && (
                <Tooltip title={`Close ${config.label}`}>
                  <EdsTabs.Tab
                    active={selectedView === config.viewId}
                    onClick={() => props.removeView(config.viewId)}
                  >
                    <Icon size={16} data={close} />
                  </EdsTabs.Tab>
                </Tooltip>
              )}
            </>
          )
        })}
      </EdsTabs.List>
    </EdsTabs>
  )
}
