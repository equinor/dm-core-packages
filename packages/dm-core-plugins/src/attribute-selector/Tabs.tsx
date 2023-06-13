import * as React from 'react'
import { Tooltip } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import { TItemData } from './types'
import Icon from './Icon'
import { StyledTabs } from './styles'

export const Tabs = (props: {
  selectedView: string
  setSelectedView: (viewId: string) => void
  items: TItemData[]
  removeView: (viewId: string) => void
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props
  return (
    <StyledTabs>
      <StyledTabs.List>
        {items.map((config: TItemData) => {
          return (
            <div key={config.viewId} className="tabs-group-wrapper">
              <StyledTabs.Tab
                key={config.viewId}
                onClick={() => setSelectedView(config.viewId)}
                active={selectedView === config.viewId}
                className="tabs-group-tab"
              >
                {config.view.eds_icon && (
                  <Icon
                    style={{ paddingRight: '4px' }}
                    name={config.view.eds_icon}
                    title={config.view.eds_icon}
                  />
                )}
                {config.label}
              </StyledTabs.Tab>
              {config.closeable && (
                <Tooltip title={`Close ${config.label}`}>
                  <StyledTabs.Tab
                    active={selectedView === config.viewId}
                    onClick={() => props.removeView(config.viewId)}
                    className="tabs-group-close-button"
                  >
                    <Icon size={16} data={close} />
                  </StyledTabs.Tab>
                </Tooltip>
              )}
            </div>
          )
        })}
      </StyledTabs.List>
    </StyledTabs>
  )
}
