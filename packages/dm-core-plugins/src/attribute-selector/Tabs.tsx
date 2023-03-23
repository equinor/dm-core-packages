import * as React from 'react'
import styled from 'styled-components'
import { TItemData } from './types'

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
  align-items: self-end;
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
  selectedView: number
  setSelectedView: Function
  items: TItemData[]
}): JSX.Element => {
  const { selectedView, setSelectedView, items } = props
  return (
    <TabsWrapper>
      {items.map((config: TItemData, index) => {
        return (
          <Tab
            key={index}
            onClick={() => setSelectedView(index)}
            active={selectedView === index}
          >
            {config.label ?? config.view.scope ?? 'self'}
          </Tab>
        )
      })}
    </TabsWrapper>
  )
}
