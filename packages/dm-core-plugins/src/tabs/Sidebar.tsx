import * as React from 'react'
import { SideBar } from '@equinor/eds-core-react'
import { home, subdirectory_arrow_right } from '@equinor/eds-icons'
import { useTabContext } from './TabsContext'
import { TChildTab } from './TabsPlugin'
import { prettifyName } from './utils'

export const Sidebar = (): JSX.Element => {
  const { entity, selectedTab, setSelectedTab, childTabs } = useTabContext()
  return (
    <SideBar open style={{ height: 'auto' }}>
      <SideBar.Content>
        <SideBar.Link
          icon={home}
          label={
            entity?.label ?? prettifyName(entity?.name || '') ?? selectedTab
          }
          onClick={() => setSelectedTab('home')}
          active={selectedTab === 'home'}
        />
        {Object.values(childTabs).map((tabData: TChildTab) => (
          <SideBar.Link
            key={tabData.attribute}
            icon={subdirectory_arrow_right}
            label={
              tabData.entity?.label ||
              prettifyName(tabData.entity?.name || '') ||
              tabData.attribute
            }
            onClick={() => setSelectedTab(tabData.attribute)}
            active={selectedTab === tabData.attribute}
          />
        ))}
      </SideBar.Content>
      <SideBar.Footer>
        <SideBar.Toggle />
      </SideBar.Footer>
    </SideBar>
  )
}
