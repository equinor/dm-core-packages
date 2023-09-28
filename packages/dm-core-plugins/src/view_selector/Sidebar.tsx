import * as React from 'react'
import { SideBar } from '@equinor/eds-core-react'
import * as EdsIcons from '@equinor/eds-icons'
import { TItemData } from './types'

export const Sidebar = (props: {
  selectedViewId: string
  setSelectedViewId: (k: string) => void
  viewSelectorItems: TItemData[]
}): JSX.Element => {
  const { selectedViewId, setSelectedViewId, viewSelectorItems } = props

  return (
    <SideBar open style={{ height: 'auto' }}>
      <SideBar.Content>
        {viewSelectorItems.map((config: TItemData) => (
          <SideBar.Link
            key={config.viewId}
            icon={
              config.viewConfig.eds_icon
                ? EdsIcons[config.viewConfig.eds_icon as keyof typeof EdsIcons]
                : EdsIcons.subdirectory_arrow_right
            }
            label={config.label}
            role="tab"
            onClick={() => setSelectedViewId(config.viewId)}
            active={selectedViewId === config.viewId}
          />
        ))}
      </SideBar.Content>
      <SideBar.Footer>
        <SideBar.Toggle />
      </SideBar.Footer>
    </SideBar>
  )
}
