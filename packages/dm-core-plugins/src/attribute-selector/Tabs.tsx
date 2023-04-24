import * as React from 'react'
import styled from 'styled-components'
import { TItemData } from './types'
import Icon from './Icon'
import { TViewConfig } from '@development-framework/dm-core'

interface ITabs {
  active: boolean
}

const Tab = styled.div<ITabs>`
  width: fit-content;
  height: 30px;
  padding: 2px 15px;
  align-self: self-end;
  background-color: #d1d1d1;
  display: flex;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  border-bottom: ${(props: ITabs) =>
    (props.active == true && '3px red solid') || '3px grey solid'};
  font-size: medium;

  &:hover {
    color: gray;
  }
`

const TabsWrapper = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px black solid;
  flex-direction: row;
`

export const Tabs = (props: {
  selectedView: string
  setSelectedView: Function
  items: TItemData[]
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props
  return (
    <TabsWrapper>
      {items.map((config: TItemData) => {
        return (
          <Tab
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
          </Tab>
        )
      })}
    </TabsWrapper>
  )
}
