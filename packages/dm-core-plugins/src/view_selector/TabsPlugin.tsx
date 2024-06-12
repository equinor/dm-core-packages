import { IUIPlugin } from '@development-framework/dm-core'
import * as React from 'react'
import { Stack } from '../common'
import { Tabs } from './Tabs'
import { TabsContent } from './TabsContent'
import { TViewSelectorConfig } from './types'
import { useViewSelector } from './useViewSelector'

export const TabsPlugin = (
  props: IUIPlugin & { config?: TViewSelectorConfig }
): React.ReactElement | null => {
  const { idReference, config, type, onSubmit, onChange } = props

  const {
    addView,
    removeView,
    isLoading,
    error,
    viewSelectorItems,
    selectedViewId,
    formData,
    setSelectedViewId,
    setFormData,
  } = useViewSelector(idReference, config, onSubmit, onChange)

  if (error) {
    throw new Error(JSON.stringify(error, null, 2))
  }
  if (isLoading || !viewSelectorItems.length || !selectedViewId) {
    return null
  }

  return (
    <Stack grow={1} minHeight={0} fullWidth>
      <Tabs
        viewSelectorItems={viewSelectorItems}
        selectedViewId={selectedViewId}
        setSelectedViewId={setSelectedViewId}
        removeView={removeView}
      />
      <TabsContent
        type={type}
        onOpen={addView}
        formData={formData}
        selectedViewId={selectedViewId}
        viewSelectorItems={viewSelectorItems}
        setFormData={setFormData}
      />
    </Stack>
  )
}
