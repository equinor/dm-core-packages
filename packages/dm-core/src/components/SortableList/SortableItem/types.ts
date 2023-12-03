import { ReactNode } from 'react'

export type SortableItemProps = {
  children: ReactNode
  style?: React.CSSProperties
  id: string
}

export type TSortableItem = {
  dragHandle?: () => React.ReactNode
  setNodeRef?: any
  style?: React.CSSProperties
}
