import {
  IUIPlugin,
  Loading,
  TGenericObject,
  UIPluginSelector,
  UIRecipesSelector,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Icon, Tooltip, SideBar } from '@equinor/eds-core-react'
import { home, subdirectory_arrow_right } from '@equinor/eds-icons'
import { TabsProvider } from './TabsContext'

interface ITabs {
  active: boolean
}

export type TChildTab = {
  attribute: string
  entity: any
  absoluteDottedId: string
  onSubmit: (data: TChildTab) => void
}

const Tab = styled.div<ITabs>`
  width: fit-content;
  height: 30px;
  padding: 2px 15px;
  align-self: self-end;
  &:hover {
    color: gray;
  }
  cursor: pointer;
  border-bottom: ${(props: ITabs) =>
    (props.active == true && '3px red solid') || '3px grey solid'};
  font-size: medium;
`

const BaseTab = styled(Tab as any)`
  background-color: #024654;
  color: white;
`

const ChildTab = styled(Tab as any)`
  background-color: #d1d1d1;
`

const HidableWrapper = styled.div<any>`
display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
align-self: normal;
`

type TStringMap = {
  [key: string]: TChildTab
}

export type TTabsPluginConfig = {
  childTabsOnRender?: boolean
  homeRecipe?: string
  asSidebar?: boolean
}

export const TabsContainer = (props: IUIPlugin): JSX.Element => {
  const { idReference, config: passedConfig, onSubmit } = props
  const config: TTabsPluginConfig = {
    childTabsOnRender: passedConfig?.childTabsOnRender ?? false,
    homeRecipe: passedConfig?.homeRecipe ?? 'home',
    asSidebar: passedConfig?.asSidebar ?? false,
  }
  const [selectedTab, setSelectedTab] = useState<string>('home')
  const [formData, setFormData] = useState<TGenericObject>({})
  const [childTabs, setChildTabs] = useState<TStringMap>({})
  const [entity, isLoading] = useDocument<TGenericObject>(idReference)

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })
    if (config.childTabsOnRender) {
      const newChildTabs: TStringMap = {}
      Object.entries(entity).forEach(([key, attributeData]: [string, any]) => {
        if (typeof attributeData == 'object') {
          newChildTabs[key] = {
            attribute: key,
            entity: attributeData,
            absoluteDottedId: `${idReference}.${key}`,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onSubmit: () => {},
          }
        }
      })
      setChildTabs(newChildTabs)
    }
  }, [entity])

  if (!entity || Object.keys(formData).length === 0)
    return <>No data in entity</>

  const handleOpen = (tabData: TChildTab) => {
    setChildTabs({ ...childTabs, [tabData.attribute]: tabData })
    setSelectedTab(tabData.attribute)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <TabsProvider onOpen={handleOpen}>
      <div
        style={{
          display: 'flex',
          flexDirection: config.asSidebar ? 'row' : 'column',
          backgroundColor: 'green',
        }}
      >
        {config.asSidebar ? (
          <SideBar open style={{ height: 'auto' }}>
            <SideBar.Content>
              <SideBar.Link
                icon={home}
                label={entity.name}
                onClick={() => setSelectedTab('home')}
                active={selectedTab === 'home'}
              />
              {Object.values(childTabs).map((tabData: TChildTab) => (
                <SideBar.Link
                  key={tabData.attribute}
                  icon={subdirectory_arrow_right}
                  label={tabData.entity.name}
                  onClick={() => setSelectedTab(tabData.attribute)}
                  active={selectedTab === tabData.attribute}
                />
              ))}
            </SideBar.Content>
            <SideBar.Footer>
              <SideBar.Toggle />
            </SideBar.Footer>
          </SideBar>
        ) : (
          <div
            style={{
              width: '100%',
              flexDirection: 'row',
              display: 'flex',
              borderBottom: '1px black solid',
            }}
          >
            <Tooltip enterDelay={600} title={entity.type} placement="top-start">
              <BaseTab
                onClick={() => setSelectedTab('home')}
                active={selectedTab === 'home'}
              >
                <Icon data={home} size={24} />
              </BaseTab>
            </Tooltip>
            {Object.values(childTabs).map((tabData: TChildTab) => (
              <Tooltip
                key={tabData.attribute}
                enterDelay={600}
                title={tabData.entity.type}
                placement="top-start"
              >
                <ChildTab
                  onClick={() => setSelectedTab(tabData.attribute)}
                  active={selectedTab === tabData.attribute}
                >
                  {tabData.entity.name}
                </ChildTab>
              </Tooltip>
            ))}
          </div>
        )}
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
      </div>
    </TabsProvider>
  )
}
