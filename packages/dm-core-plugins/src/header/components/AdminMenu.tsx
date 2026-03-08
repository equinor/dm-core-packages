import { useApplication } from '@development-framework/dm-core'
import { Button, Icon, Menu } from '@equinor/eds-core-react'
import { menu, refresh } from '@equinor/eds-icons'
import { useId, useRef, useState } from 'react'
import { toast } from 'react-toastify'

export function AdminMenu() {
  const { dmssAPI, name } = useApplication()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const menuButtonId = useId()

  function handleRefreshRecipes() {
    dmssAPI
      .refreshLookup({ application: name })
      .then(() => {
        Object.keys(window.sessionStorage).forEach((key) => {
          if (key.startsWith('BLUEPRINT::'))
            window.sessionStorage.removeItem(key)
        })
        toast.success(`RecipeLookup for app '${name}' updated`)
      })
      .catch((error: any) => {
        console.error(error)
        toast.error(`Failed to refresh application '${name}'`)
      })
    setIsMenuOpen(false)
  }

  return (
    <>
      <Button
        aria-label='Open application menu'
        aria-haspopup='menu'
        aria-controls={`${menuButtonId}-menu`}
        variant='ghost_icon'
        id={menuButtonId}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        ref={menuButtonRef}
      >
        <Icon data={menu} size={24} />
      </Button>
      <Menu
        anchorEl={menuButtonRef.current}
        placement='bottom-end'
        id={`${menuButtonId}-menu`}
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <Menu.Item onClick={handleRefreshRecipes}>
          <Icon data={refresh} />
          Refresh application recipes
        </Menu.Item>
      </Menu>
    </>
  )
}
