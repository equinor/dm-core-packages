import {
  TGenericObject,
  TOnOpen,
  ViewCreator,
} from '@development-framework/dm-core'
import * as React from 'react'
import styled from 'styled-components'
import { TItemData } from './types'

const HidableWrapper = styled.div<any>`
  display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
  align-self: normal;
  width: 100%;
`

export const Content = (props: {
  type: string
  selectedViewId: string
  viewSelectorItems: TItemData[]
  setFormData: (v: TGenericObject) => void
  onOpen: TOnOpen
  formData: TGenericObject
  style?: Record<string, string | number>
}): React.ReactElement => {
  const { selectedViewId, viewSelectorItems, setFormData, formData, onOpen } =
    props
  return (
    <div style={props.style}>
      {viewSelectorItems.map((config: TItemData) => (
        <HidableWrapper
          key={config.viewId}
          hidden={config.viewId !== selectedViewId}
          role="tabpanel"
        >
          <ViewCreator
            idReference={config.rootEntityId}
            viewConfig={config.viewConfig}
            onOpen={onOpen}
            onSubmit={(data: TGenericObject) => {
              setFormData({
                ...formData,
                [config.viewId]: data,
              })
            }}
          />
        </HidableWrapper>
      ))}
    </div>
  )
}
