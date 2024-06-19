import {
  TGenericObject,
  TOnOpen,
  TValidEntity,
  ViewCreator,
} from '@development-framework/dm-core'
import * as React from 'react'
import { LazyLoad } from '../common'
import { TItemData } from './types'

export const TabsContent = (props: {
  type: string
  selectedViewId: string
  viewSelectorItems: TItemData[]
  setFormData: (v: TGenericObject) => void
  onOpen: TOnOpen
  formData: TGenericObject
  style?: Record<string, string | number>
  entity?: TValidEntity
}): React.ReactElement => {
  const { selectedViewId, viewSelectorItems, setFormData, formData, onOpen } =
    props
  return (
    <div className='flex-layout-container scroll' style={props.style}>
      {viewSelectorItems.map((config: TItemData) => (
        <LazyLoad
          key={config.viewId}
          visible={selectedViewId === config.viewId}
          role='tabpanel'
        >
          {config.viewConfig ? (
            <ViewCreator
              idReference={config.rootEntityId}
              entity={config.entity}
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
