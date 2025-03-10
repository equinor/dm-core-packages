import type { ReactNode } from 'react'

export type SortableItemProps<T extends { key: string | number }> = {
  children: ReactNode
  style?: React.CSSProperties
  item: T
}

export type TSortableItem = {
  dragHandle?: () => React.ReactNode
  setNodeRef?: any
  style?: React.CSSProperties
}
