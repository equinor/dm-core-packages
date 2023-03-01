import * as React from 'react'
import styled from 'styled-components'
import {
  TGenericObject,
  UIPluginSelector,
  UIRecipesSelector,
} from '@development-framework/dm-core'
import { useTabContext } from './TabsContext'
import { TChildTab } from './TabsPlugin'

const HidableWrapper = styled.div<any>`
  display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
  align-self: normal;
`

export const Content = (): JSX.Element => {
  const {
    selectedTab,
    setSelectedTab,
    childTabs,
    setChildTabs,
    formData,
    setFormData,
    onSubmit,
    idReference,
    config,
  } = useTabContext()
  return (
    <>
      <HidableWrapper hidden={'home' !== selectedTab}>
        <UIPluginSelector
          idReference={idReference}
          type={formData.type}
          onOpen={(tabData: TChildTab) => {
            setChildTabs({ ...childTabs, [tabData.attribute]: tabData })
            setSelectedTab(tabData.attribute)
          }}
          onSubmit={(newFormData: TGenericObject) => {
            setFormData({ ...newFormData })
            if (onSubmit) {
              onSubmit(newFormData)
            }
          }}
          config={{ recipes: [config?.homeRecipe] || [] }}
        />
      </HidableWrapper>
      {Object.values(childTabs).map((childTab: TChildTab) => {
        return (
          <HidableWrapper
            key={childTab.attribute}
            hidden={childTab.attribute !== selectedTab}
          >
            <UIRecipesSelector
              idReference={childTab.absoluteDottedId}
              type={childTab.entity.type}
              onSubmit={(data: TChildTab) => {
                const newFormData = {
                  ...formData,
                  [childTab.attribute]: data,
                }
                setFormData(newFormData)
                if (childTab?.onSubmit) {
                  childTab.onSubmit(data)
                }
              }}
            />
          </HidableWrapper>
        )
      })}
    </>
  )
}
