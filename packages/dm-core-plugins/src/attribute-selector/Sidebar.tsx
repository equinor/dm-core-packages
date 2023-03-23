import * as React from 'react'
import { SideBar } from '@equinor/eds-core-react'
import { subdirectory_arrow_right } from '@equinor/eds-icons'
import { TItemData } from './types'

export const Sidebar = (props: {
  selectedView: number
  setSelectedView: Function
  items: TItemData[]
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props

  return (
    <SideBar open style={{ height: 'auto' }}>
      <SideBar.Content>
        {items.map((config: TItemData, index) => (
          <SideBar.Link
            key={index}
            icon={subdirectory_arrow_right}
            label={config.label ?? config.view.scope ?? 'self'}
            onClick={() => setSelectedView(index)}
            active={selectedView === index}
          />
        ))}
      </SideBar.Content>
      <SideBar.Footer>
        <SideBar.Toggle />
      </SideBar.Footer>
    </SideBar>
  )
}
