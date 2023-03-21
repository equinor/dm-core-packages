import * as React from 'react'
import styled from 'styled-components'
import {
  TGenericObject,
  EntityView,
  useBlueprint,
  Loading,
} from '@development-framework/dm-core'
import { useTabContext } from './TabsContext'
import { TChildTab } from './AttributeSelectorPlugin'

const HidableWrapper = styled.div<any>`
  display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
  align-self: normal;
  width: 100%;
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

  // TODO: This is a workaround until 'attribute-selector' implements "view concept"
  const { uiRecipes, isLoading } = useBlueprint(formData.type)
  if (isLoading) return <Loading />

  return (
    <div style={{ width: '100%' }}>
      <HidableWrapper hidden={'home' !== selectedTab}>
        <EntityView
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
          recipeName={uiRecipes[0].name}
          config={config}
        />
      </HidableWrapper>
      {Object.values(childTabs).map((childTab: TChildTab) => {
        return (
          <HidableWrapper
            key={childTab.attribute}
            hidden={childTab.attribute !== selectedTab}
          >
            <EntityView
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
    </div>
  )
}
