import { ReactNode } from 'react'

export type SortableListProps = {
  items: any[]
  children: ReactNode
}

export type SortableContextProps<T extends { key: string | number }> = {
  items: T[]
  children: ReactNode
  onReorder: (reorderedItems: T[]) => void
}
