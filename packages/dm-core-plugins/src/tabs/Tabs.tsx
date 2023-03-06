import * as React from 'react'
import { Icon, Tooltip } from '@equinor/eds-core-react'
import { home } from '@equinor/eds-icons'
import styled from 'styled-components'
import { TChildTab } from './TabsPlugin'
import { useTabContext } from './TabsContext'
import { prettifyName } from './utils'

interface ITabs {
  active: boolean
}

const Tab = styled.div<ITabs>`
  width: fit-content;
  height: 30px;
  padding: 2px 15px;
  align-self: self-end;

  &:hover {
    color: gray;
  }

  cursor: pointer;
  border-bottom: ${(props: ITabs) =>
    (props.active == true && '3px red solid') || '3px grey solid'};
  font-size: medium;
`

const BaseTab = styled(Tab as any)`
  background-color: #024654;
  color: white;
`

const ChildTab = styled(Tab as any)`
  background-color: #d1d1d1;
  display: flex;
  align-items: self-end;
`

export const Tabs = (): JSX.Element => {
  const {
    entity,
    selectedTab,
    setSelectedTab,
    childTabs,
    config,
  } = useTabContext()
  return (
    <div
      style={{
        width: '100%',
        flexDirection: 'row',
        display: 'flex',
        borderBottom: '1px black solid',
      }}
    >
      <Tooltip enterDelay={600} title={entity.type} placement="top-start">
        <BaseTab
          onClick={() => setSelectedTab('home')}
          active={selectedTab === 'home'}
        >
          <Icon data={home} size={24} />
        </BaseTab>
      </Tooltip>
      {Object.values(childTabs).map((tabData: TChildTab) => {
        if (
          config?.visibleAttributes === undefined ||
          config?.visibleAttributes.includes(tabData.attribute) ||
          config?.visibleAttributes.length === 0
        ) {
          return (
            <Tooltip
              key={tabData.attribute}
              enterDelay={600}
              title={tabData.entity.type}
              placement="top-start"
            >
              <ChildTab
                onClick={() => setSelectedTab(tabData.attribute)}
                active={selectedTab === tabData.attribute}
              >
                {tabData.entity?.label ||
                  prettifyName(tabData.entity?.name || '') ||
                  tabData.attribute}
              </ChildTab>
            </Tooltip>
          )
        }
      })}
    </div>
  )
}
