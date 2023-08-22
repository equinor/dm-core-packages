import { Tabs as EdsTabs, Tooltip } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import * as React from 'react'
import Icon from './Icon'
import { StyledTabs } from './styles'
import { TItemData } from './types'

export const Tabs = (props: {
  selectedView: string
  setSelectedView: (viewId: string) => void
  items: TItemData[]
  removeView: (viewId: string) => void
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props
  return (
    <StyledTabs>
      <EdsTabs.List>
        {items.map((config: TItemData) => {
          return (
            <div key={config.viewId} className="tabs-group-wrapper">
              <EdsTabs.Tab
                key={config.viewId}
                onClick={() => setSelectedView(config.viewId)}
                active={selectedView === config.viewId}
                className="tabs-group-tab"
              >
                {config.view?.eds_icon && (
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
                    className="tabs-group-close-button"
                  >
                    <Icon size={16} data={close} />
                  </EdsTabs.Tab>
                </Tooltip>
              )}
            </div>
          )
        })}
      </EdsTabs.List>
    </StyledTabs>
  )
}
