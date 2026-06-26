import { Button, Menu } from '@equinor/eds-core-react'
import { useRef, useState } from 'react'
import { TEMPLATES, type TTemplate } from '../templates'

export const TemplatesMenu = ({
  onApply,
}: {
  onApply: (template: TTemplate) => void
}): React.ReactElement => {
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        ref={anchorRef}
        variant='outlined'
        aria-haspopup='menu'
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Templates
      </Button>
      <Menu
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        placement='bottom-start'
      >
        <Menu.Section title='Start from a template'>
          {TEMPLATES.map((template) => (
            <Menu.Item
              key={template.id}
              onClick={() => {
                onApply(template)
                setOpen(false)
              }}
            >
              {template.label}
            </Menu.Item>
          ))}
        </Menu.Section>
      </Menu>
    </>
  )
}
