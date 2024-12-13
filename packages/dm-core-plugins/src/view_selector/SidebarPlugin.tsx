import {
  type IUIPlugin,
  Loading,
  type TGenericObject,
  ViewCreator,
} from '@development-framework/dm-core'
import { Stack } from '../common'
import { Sidebar } from './Sidebar'
import type { TItemData, TViewSelectorConfig } from './types'
import { useViewSelector } from './useViewSelector'

export const SidebarPlugin = (
  props: IUIPlugin & { config?: TViewSelectorConfig }
): React.ReactElement => {
  const { idReference, config, type } = props

  const {
    addView,
    isLoading,
    error,
    viewSelectorItems,
    selectedViewId,
    formData,
    setSelectedViewId,
    setFormData,
  } = useViewSelector(idReference, config)

  if (error) {
    throw new Error(JSON.stringify(error, null, 2))
  }
  if (isLoading || !viewSelectorItems.length || !selectedViewId) {
    return <Loading />
  }

  const viewItem: TItemData = viewSelectorItems.find(
    (viewItem: TItemData) => viewItem.viewId === selectedViewId
  ) as TItemData

  return (
    <Stack direction='row' fullWidth grow={1} minHeight={0}>
      <Sidebar
        viewSelectorItems={viewSelectorItems}
        selectedViewId={selectedViewId}
        setSelectedViewId={setSelectedViewId}
        addView={addView}
      />
      <Stack direction='row' fullWidth grow={1} minHeight={0} scrollY>
        {viewItem.viewConfig ? (
          <ViewCreator
            key={`${viewItem.rootEntityId}-${viewItem.viewConfig.scope}`}
            idReference={viewItem.rootEntityId}
            viewConfig={viewItem.viewConfig}
            onOpen={addView}
            onSubmit={(data: TGenericObject) => {
              if (viewItem?.onSubmit) viewItem?.onSubmit(data)
              setFormData({
                ...formData,
                [viewItem.viewId]: data,
              })
            }}
            onChange={viewItem?.onChange}
          />
        ) : (
          <p>
            {viewItem.label ?? viewItem.viewId} was selected, but has no view
            defined
          </p>
        )}
      </Stack>
    </Stack>
  )
}
