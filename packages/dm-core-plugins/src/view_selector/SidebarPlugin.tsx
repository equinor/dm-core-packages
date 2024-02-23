import { IUIPlugin, Loading } from '@development-framework/dm-core'
import React from 'react'
import { Content } from './Content'
import { Sidebar } from './Sidebar'
import { TViewSelectorConfig } from './types'
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

  return (
    <div className='flex-layout-container flex-row'>
      <Sidebar
        viewSelectorItems={viewSelectorItems}
        selectedViewId={selectedViewId}
        setSelectedViewId={setSelectedViewId}
        addView={addView}
      />
      <Content
        type={type}
        onOpen={addView}
        formData={formData}
        selectedViewId={selectedViewId}
        viewSelectorItems={viewSelectorItems}
        setFormData={setFormData}
      />
    </div>
  )
}
