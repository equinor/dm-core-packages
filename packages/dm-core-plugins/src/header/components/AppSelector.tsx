import { Button, Icon, Menu } from '@equinor/eds-core-react'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { useRef, useState } from 'react'

interface AppSelectorProps {
  items: string[]
  currentItem: string
  onSelectItem: (item: string) => void
}

export const AppSelector = ({
  onSelectItem,
  currentItem,
  items,
}: AppSelectorProps) => {
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const referenceElement = useRef<HTMLDivElement | null>(null)

  return (
    <div ref={referenceElement}>
      <Button
        variant='ghost'
        onClick={() => setAppSelectorOpen(!appSelectorOpen)}
        aria-label='AppSelector'
      >
        {currentItem}
        <Icon data={appSelectorOpen ? chevron_up : chevron_down}></Icon>
      </Button>
      <Menu
        open={appSelectorOpen}
        anchorEl={referenceElement.current}
        onClose={() => setAppSelectorOpen(false)}
      >
        {items.map((recipe: string, index: number) => (
          <Menu.Item
            key={index}
            active={currentItem === recipe}
            onClick={() => {
              onSelectItem(recipe)
              setAppSelectorOpen(false)
            }}
          >
            {recipe}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  )
}
