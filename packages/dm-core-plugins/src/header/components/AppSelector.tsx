import { Icon, Popover, Typography } from '@equinor/eds-core-react'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import React, { useState, useRef } from 'react'
import styled from 'styled-components'

export const MenuButton = styled.button<{ $active: boolean }>`
  appearance: none;
  background-color: ${(props) =>
    props.$active ? 'rgba(230,250,236,1)' : 'transparent'};
  color: ${(props) => (props.$active ? 'rgba(0, 79, 85, 1)' : 'black')};
  border: 0;
  cursor: pointer;
  min-width: 150px;
  text-align: left;
  padding: 1rem 3rem 1rem 3rem;
  font-family: 'Equinor', sans-serif;

  &:hover {
    background-color: ${(props) =>
      !props.$active ? 'rgba(220,220,220,255)' : 'rgba(230,250,236,1)'};
    color: ${(props) =>
      !props.$active ? 'rgba(61,61,61,255)' : 'rgba(0, 79, 85, 1)'};
  }
`

interface AppSelectorProps {
  items: string[]
  currentItem: string
  onSelectItem: (item: string) => void
}

const AppSelectorButton = styled.button`
  display: flex;
  marginleft: 60px;
  border: 0;
  appearance: none;
  align-content: center;
  background-color: transparent;
  &:hover {
    color: gray;
    cursor: pointer;
  }
`

export const AppSelector = ({
  onSelectItem,
  currentItem,
  items,
}: AppSelectorProps) => {
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const referenceElement = useRef<HTMLDivElement | null>(null)

  return (
    <div ref={referenceElement}>
      <AppSelectorButton
        onClick={() => setAppSelectorOpen(!appSelectorOpen)}
        aria-label='AppSelector'
      >
        <span className="text-xs font-bold self-center">{currentItem}</span>
        <Icon
          className="mt-0.5"
          data={appSelectorOpen ? chevron_up : chevron_down}
        ></Icon>
      </AppSelectorButton>
      <Popover
        open={appSelectorOpen}
        anchorEl={referenceElement.current}
        trapFocus
        onClose={() => {
          setAppSelectorOpen(false)
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((recipe: string, index: number) => (
            <MenuButton
              $active={currentItem === recipe}
              key={index}
              onClick={() => {
                onSelectItem(recipe)
                setAppSelectorOpen(false)
              }}
            >
              <Typography>{recipe}</Typography>
            </MenuButton>
          ))}
        </div>
      </Popover>
    </div>
  )
}
