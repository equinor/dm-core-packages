import {
  LazyLoad,
  TGenericObject,
  TOnOpen,
  ViewCreator,
} from '@development-framework/dm-core'
import * as React from 'react'
import { TItemData } from './types'

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
        <LazyLoad
          key={config.viewId}
          visible={selectedViewId === config.viewId}
          role='tabpanel'
        >
          {config.viewConfig ? (
            <ViewCreator
              idReference={config.rootEntityId}
              viewConfig={config.viewConfig}
              onOpen={onOpen}
              onSubmit={(data: TGenericObject) => {
                if (config?.onSubmit) config?.onSubmit(data)
                setFormData({
                  ...formData,
                  [config.viewId]: data,
                })
              }}
              onChange={config?.onChange}
            />
          ) : (
            <p>
              {config.label ?? config.viewId} was selected, but has no view
              defined
            </p>
          )}
        </LazyLoad>
      ))}
    </div>
  )
}
