import { EdsProvider, Menu } from '@equinor/eds-core-react'
import React, { ReactNode, useRef, useState } from 'react'

export type TTemplate = {
  label: string
  path: string
}

interface TemplateMenuProps {
  templates: TTemplate[]
  onSelect: (template: TTemplate) => void
  isOpen: boolean
  onClose: () => void
  anchorRef?: any
}

export const TemplateMenu = (props: TemplateMenuProps) => {
  const { templates, onSelect, isOpen, onClose, anchorRef } = props
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
        {templates.map((template: TTemplate) => {
          return (
            <Menu.Item key={template.label} onClick={() => onSelect(template)}>
              {template.label}
            </Menu.Item>
          )
        })}
      </Menu>
    </span>
  )
}
