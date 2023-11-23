import * as React from 'react'
import { SideBar } from '@equinor/eds-core-react'
import * as EdsIcons from '@equinor/eds-icons'
import { TItemData } from './types'
import { TOnOpen } from '@development-framework/dm-core'

export const Sidebar = (props: {
  selectedViewId: string
  setSelectedViewId: (k: string) => void
  viewSelectorItems: TItemData[]
  addView: TOnOpen
}): React.ReactElement => {
  const { selectedViewId, setSelectedViewId, viewSelectorItems, addView } =
    props

  return (
    <SideBar open style={{ height: 'auto' }}>
      <SideBar.Content>
        {viewSelectorItems.map((config: TItemData) => {
          // subItem's will be rendered inside other items. Don't add them here
          if (config.isSubItem) return null

          return (
            <div key={config.viewId}>
              {config.subItems ? (
                <SideBar.Accordion
                  key={config.viewId}
                  icon={
                    config.viewConfig.eds_icon
                      ? EdsIcons[
                          config.viewConfig.eds_icon as keyof typeof EdsIcons
                        ]
                      : EdsIcons.subdirectory_arrow_right
                  }
                  label={config.label}
                  role="tab"
                >
                  {config.subItems.map((subConfig: TItemData, index) => {
                    const subViewId = config.viewId + subConfig.viewConfig.scope
                    return (
                      <SideBar.AccordionItem
                        key={index}
                        icon={
                          subConfig.viewConfig.eds_icon
                            ? EdsIcons[
                                subConfig.viewConfig
                                  .eds_icon as keyof typeof EdsIcons
                              ]
                            : EdsIcons.subdirectory_arrow_right
                        }
                        label={subConfig.label}
                        role="tab"
                        onClick={() => {
                          addView(
                            subViewId,
                            subConfig.viewConfig,
                            undefined,
                            true
                          )
                          setSelectedViewId(subViewId)
                        }}
                        active={selectedViewId === subViewId}
                      />
                    )
                  })}
                </SideBar.Accordion>
              ) : (
                <SideBar.Link
                  key={config.viewId}
                  icon={
                    config.viewConfig.eds_icon
                      ? EdsIcons[
                          config.viewConfig.eds_icon as keyof typeof EdsIcons
                        ]
                      : EdsIcons.subdirectory_arrow_right
                  }
                  label={config.label}
                  role="tab"
                  onClick={() => setSelectedViewId(config.viewId)}
                  active={selectedViewId === config.viewId}
                />
              )}
            </div>
          )
        })}
      </SideBar.Content>
      <SideBar.Footer>
        <SideBar.Toggle />
      </SideBar.Footer>
    </SideBar>
  )
}
