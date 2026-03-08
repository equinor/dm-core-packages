import type { TUiRecipe } from '@development-framework/dm-core'
import { Button, Icon, Menu } from '@equinor/eds-core-react'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { useId, useRef, useState } from 'react'
import type { UIRecipeItem } from '../HeaderPlugin.types'

interface AppSelectorProps {
  items: UIRecipeItem[] | TUiRecipe[]
  currentItem: string
  onSelectItem: (item: string) => void
  isLoading?: boolean
}

export const AppSelector = ({
  onSelectItem,
  currentItem,
  items,
  isLoading,
}: AppSelectorProps) => {
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const appSelectorButtonRef = useRef<HTMLButtonElement | null>(null)
  const appSelectorId = useId()

  const listType =
    items.length > 0 && 'recipeName' in items[0] ? 'UIRecipeItem' : 'TUiRecipe'

  const normalizedList =
    listType === 'UIRecipeItem'
      ? (items as UIRecipeItem[]).map((item) => ({
          name: item.recipeName,
          label: item.label,
        }))
      : (items as TUiRecipe[]).map((item) => ({
          name: item.name,
          label: item.name,
        }))

  return (
    <>
      <Button
        variant='ghost'
        onClick={() => setAppSelectorOpen(!appSelectorOpen)}
        aria-label='AppSelector'
        aria-haspopup='menu'
        aria-controls={`${appSelectorId}-menu`}
        data-testid='application-selector-button'
        disabled={isLoading}
        ref={appSelectorButtonRef}
        id={appSelectorId}
      >
        {currentItem}
        <Icon data={appSelectorOpen ? chevron_up : chevron_down}></Icon>
      </Button>
      <Menu
        open={appSelectorOpen}
        anchorEl={appSelectorButtonRef.current}
        onClose={() => setAppSelectorOpen(false)}
        id={`${appSelectorId}-menu`}
      >
        {normalizedList.map((item, index: number) => (
          <Menu.Item
            key={index}
            active={currentItem === item.name}
            onClick={() => onSelectItem(item.name)}
          >
            {item.label || item.name}
          </Menu.Item>
        ))}
      </Menu>
    </>
  )
}
