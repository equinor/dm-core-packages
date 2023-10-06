import { IUIPlugin, Loading } from '@development-framework/dm-core'
import * as React from 'react'
import { Content } from './Content'
import { Sidebar } from './Sidebar'
import { Tabs } from './Tabs'
import { TViewSelectorConfig } from './types'
import { useViewSelector } from './useViewSelector'

export const ViewSelectorPlugin = (
  props: IUIPlugin & { config?: TViewSelectorConfig }
): JSX.Element => {
  const { idReference, config, type } = props

  const {
    addView,
    removeView,
    isLoading,
    error,
    internalConfig,
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
    <div
      style={{
        display: 'flex',
        flexDirection: internalConfig.asSidebar ? 'row' : 'column',
        width: '100%',
      }}
    >
      {internalConfig.asSidebar ? (
        <Sidebar
          viewSelectorItems={viewSelectorItems}
          selectedViewId={selectedViewId}
          setSelectedViewId={setSelectedViewId}
        />
      ) : (
        <Tabs
          viewSelectorItems={viewSelectorItems}
          selectedViewId={selectedViewId}
          setSelectedViewId={setSelectedViewId}
          removeView={removeView}
        />
      )}
      <div
        style={{
          ...(internalConfig.asSidebar
            ? { paddingLeft: '8px' }
            : { paddingTop: '8px' }),
          paddingRight: '8px',
        }}
      >
        <Content
          style={{
            ...(internalConfig.asSidebar
              ? { paddingLeft: '8px' }
              : { paddingTop: '8px' }),
            paddingRight: '8px',
          }}
          type={type}
          onOpen={addView}
          formData={formData}
          selectedViewId={selectedViewId}
          viewSelectorItems={viewSelectorItems}
          setFormData={setFormData}
        />
      </div>
    </div>
  )
}
