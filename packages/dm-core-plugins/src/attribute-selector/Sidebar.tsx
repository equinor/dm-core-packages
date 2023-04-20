import * as React from 'react'
import { SideBar } from '@equinor/eds-core-react'
import { subdirectory_arrow_right } from '@equinor/eds-icons'
import { TItemData } from './types'
import { availableIcons } from './Icon'

export const Sidebar = (props: {
  selectedView: string
  setSelectedView: (k: string) => void
  items: TItemData[]
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props

  return (
    <SideBar open style={{ height: 'auto' }}>
      <SideBar.Content>
        {items.map((config: TItemData) => (
          <SideBar.Link
            key={config.viewId}
            icon={
              config.view.eds_icon
                ? availableIcons[config.view.eds_icon]
                : subdirectory_arrow_right
            }
            label={config.label}
            onClick={() => setSelectedView(config.viewId)}
            active={selectedView === config.viewId}
          />
        ))}
      </SideBar.Content>
      <SideBar.Footer>
        <SideBar.Toggle />
      </SideBar.Footer>
    </SideBar>
  )
}
