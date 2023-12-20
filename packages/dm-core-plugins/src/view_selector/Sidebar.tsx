import * as React from 'react'
import { Divider, SideBar } from '@equinor/eds-core-react'
import * as EdsIcons from '@equinor/eds-icons'
import { TItemData, TViewSelectorItem } from './types'
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
        {viewSelectorItems.map((viewItem: TItemData) => {
          // subItem's will be rendered inside other items. Don't add them here
          if (viewItem.isSubItem) return null
          return (
            <div key={viewItem.viewId}>
              {viewItem.subItems ? (
                <SideBar.Accordion
                  key={viewItem.viewId}
                  active={selectedViewId === viewItem.viewId}
                  icon={
                    viewItem.eds_icon
                      ? EdsIcons[viewItem.eds_icon as keyof typeof EdsIcons]
                      : viewItem.viewConfig?.eds_icon
                        ? EdsIcons[
                            viewItem.viewConfig
                              ?.eds_icon as keyof typeof EdsIcons
                          ]
                        : EdsIcons.subdirectory_arrow_right
                  }
                  label={viewItem.label}
                  onClick={() => {
                    if (viewItem.viewConfig) {
                      setSelectedViewId(viewItem.viewId)
                    }
                  }}
                  role='tab'
                >
                  {viewItem.subItems.map(
                    (subItem: TViewSelectorItem, index) => {
                      const subViewId =
                        viewItem.viewId + subItem.viewConfig?.scope
                      return (
                        <SideBar.AccordionItem
                          key={index}
                          label={
                            subItem.label ??
                            subItem.viewConfig?.scope ??
                            subViewId
                          }
                          role='tab'
                          onClick={() => {
                            if (subItem.viewConfig) {
                              setSelectedViewId(subViewId)
                            }
                          }}
                          active={selectedViewId === subViewId}
                        />
                      )
                    }
                  )}
                </SideBar.Accordion>
              ) : (
                <SideBar.Link
                  key={viewItem.viewId}
                  icon={
                    viewItem.eds_icon
                      ? EdsIcons[viewItem.eds_icon as keyof typeof EdsIcons]
                      : viewItem.viewConfig?.eds_icon
                        ? EdsIcons[
                            viewItem.viewConfig
                              ?.eds_icon as keyof typeof EdsIcons
                          ]
                        : EdsIcons.subdirectory_arrow_right
                  }
                  label={viewItem.label}
                  role='tab'
                  onClick={() => setSelectedViewId(viewItem.viewId)}
                  active={selectedViewId === viewItem.viewId}
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
