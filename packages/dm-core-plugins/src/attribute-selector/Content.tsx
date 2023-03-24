import * as React from 'react'
import styled from 'styled-components'
import { TGenericObject, ViewCreator } from '@development-framework/dm-core'
import { TItemData } from './types'

const HidableWrapper = styled.div<any>`
  display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
  align-self: normal;
  width: 100%;
`

export const Content = (props: {
  selectedView: number
  items: TItemData[]
  setFormData: Function
  formData: TGenericObject
}): JSX.Element => {
  const { selectedView, items, setFormData, formData } = props

  return (
    <div style={{ width: '100%' }}>
      {items.map((config: TItemData, index) => {
        if (config.view.scope === undefined) {
          return <div></div>
        } else {
          return (
            <HidableWrapper key={index} hidden={index !== selectedView}>
              <ViewCreator
                idReference={config.rootEntityId}
                viewConfig={config.view}
                type={config.view.type}
                // TODO: Fix this
                onSubmit={(data: TGenericObject) => {
                  setFormData({
                    ...formData,
                    [config.view?.scope ?? '?????']: data,
                  })
                }}
              />
            </HidableWrapper>
          )
        }
      })}
    </div>
  )
}
