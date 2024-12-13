import {
  type TGenericObject,
  type TOnOpen,
  ViewCreator,
} from '@development-framework/dm-core'
import { LazyLoad, Stack } from '../common'
import type { TItemData } from './types'

export const TabsContent = (props: {
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
    <Stack grow={1} minHeight={0} fullWidth scrollY style={props.style}>
      {viewSelectorItems.map((config: TItemData) => (
        <LazyLoad
          key={config.viewId}
          visible={selectedViewId === config.viewId}
          role='tabpanel'
          data-testid={`${
            selectedViewId === config.viewId ? 'enabled' : 'disabled'
          }:${config.rootEntityId}`}
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
    </Stack>
  )
}
