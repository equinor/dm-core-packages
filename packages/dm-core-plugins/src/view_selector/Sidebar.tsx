import { TOnOpen } from '@development-framework/dm-core'
import { Button, Icon, SideBar } from '@equinor/eds-core-react'
import * as EdsIcons from '@equinor/eds-icons'
import * as React from 'react'
import { breakpoints } from '../responsive_grid/types'
import { CustomToggle } from './styles'
import { TItemData, TViewSelectorItem } from './types'

export const Sidebar = (props: {
  selectedViewId: string
  setSelectedViewId: (k: string) => void
  viewSelectorItems: TItemData[]
  addView: TOnOpen
}): React.ReactElement => {
  const { selectedViewId, setSelectedViewId, viewSelectorItems, addView } =
    props
  const [isOpen, setIsOpen] = React.useState<boolean>(true)

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpoints?.md) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <SideBar open={isOpen} onToggle={(state: boolean) => setIsOpen(state)}>
      <SideBar.Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'scroll',
        }}
      >
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
      <SideBar.Footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CustomToggle expanded={isOpen}>
          <Button
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={() => setIsOpen(!isOpen)}
            variant='ghost_icon'
            color='secondary'
          >
            <Icon data={EdsIcons.expand} />
          </Button>
        </CustomToggle>
      </SideBar.Footer>
    </SideBar>
  )
}
