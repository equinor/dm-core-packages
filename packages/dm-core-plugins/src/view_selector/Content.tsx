import {
  TGenericObject,
  TOnOpen,
  ViewCreator,
} from '@development-framework/dm-core'
import * as React from 'react'
import { TItemData } from './types'
import { PropsWithChildren, useRef } from 'react'
import styled from 'styled-components'

type LazyProps = {
  visible: boolean
}

const HideContentWrapper = styled.div<any>`
  display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
  align-self: normal;
  width: 100%;
`

const Lazy = ({ visible, children }: PropsWithChildren<LazyProps>) => {
  const rendered = useRef(visible)

  if (visible && !rendered.current) {
    rendered.current = true
  }

  if (!rendered.current) return null

  return (
    <HideContentWrapper hidden={!visible} role="tabpanel">
      {children}
    </HideContentWrapper>
  )
}

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
        <Lazy key={config.viewId} visible={selectedViewId == config.viewId}>
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
        </Lazy>
      ))}
    </div>
  )
}
