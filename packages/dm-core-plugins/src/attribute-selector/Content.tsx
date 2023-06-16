import * as React from 'react'
import styled from 'styled-components'
import {
  TGenericObject,
  TViewConfig,
  ViewCreator,
} from '@development-framework/dm-core'
import { TItemData } from './types'

const HidableWrapper = styled.div<any>`
  display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
  align-self: normal;
  width: 100%;
`

export const Content = (props: {
  type: string
  selectedView: string
  items: TItemData[]
  setFormData: (v: TGenericObject) => void
  onOpen: (id: string, v: TViewConfig) => void
  formData: TGenericObject
}): JSX.Element => {
  const { selectedView, items, setFormData, formData, onOpen, type } = props

  return (
    <div style={{ width: '100%' }}>
      {items.map((config) => {
        console.log(
          'WILL DISPLAY In VC with idRef ',
          config.rootEntityId,
          ' AND scope ',
          config.view.scope
        )
      })}
      {items.map((config: TItemData) => (
        <HidableWrapper
          key={config.viewId}
          hidden={config.viewId !== selectedView}
        >
          <ViewCreator
            idReference={config.rootEntityId}
            viewConfig={config.view}
            onOpen={(id: string, v: TViewConfig) => {
              onOpen(id, v)
            }}
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
