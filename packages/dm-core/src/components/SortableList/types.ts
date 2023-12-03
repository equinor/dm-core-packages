import { ReactNode } from 'react'

export type SortableListProps = {
  items: any[]
  children: ReactNode
}

export type SortableContextProps = {
  items: any[]
  children: ReactNode
  onReorder: (reorderedItems: any) => void
}
