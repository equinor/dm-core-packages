import { ReactNode } from 'react'

export type SortableListProps<T extends { id: string | number }> = {
  items: T[]
  children: ReactNode
}

export type SortableContextProps<T extends { id: string | number }> = {
  items: T[]
  children: ReactNode
  onReorder: (reorderedItems: T[]) => void
}
