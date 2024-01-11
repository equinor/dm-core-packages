import { Menu } from '@equinor/eds-core-react'
import React, { useRef } from 'react'

export type TTemplate = {
  label: string
  path: string
}

interface TemplateMenuProps {
  templates: TTemplate[]
  onSelect: (template: TTemplate, index: number) => void
  isOpen: boolean
  title?: string
  selected?: number
  onClose: () => void
  anchorRef?: any
}

export const TemplateMenu = (props: TemplateMenuProps) => {
  const { templates, onSelect, isOpen, onClose, anchorRef, title, selected } =
    props
  const anchorEl = useRef<HTMLButtonElement | null>(null)

  return (
    <span ref={anchorEl}>
      <Menu
        open={isOpen}
        id='menu-match'
        aria-labelledby='anchor-match'
        onClose={onClose}
        anchorEl={anchorRef ? anchorRef.current : anchorEl.current}
      >
        <Menu.Section title={title || 'Templates'}>
          {templates.map((template: TTemplate, index: number) => {
            return (
              <Menu.Item
                key={`${template.label}-${index}`}
                onClick={() => onSelect(template, index)}
                active={selected === index}
              >
                {template.label}
              </Menu.Item>
            )
          })}
        </Menu.Section>
      </Menu>
    </span>
  )
}
