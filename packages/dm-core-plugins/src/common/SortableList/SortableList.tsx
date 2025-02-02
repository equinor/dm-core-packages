import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type { SortableListProps } from './types'

export const SortableList = ({ items, children }: SortableListProps) => {
  return (
    <SortableContext
      items={items.map((item) => item.key)}
      strategy={verticalListSortingStrategy}
    >
      {children}
    </SortableContext>
  )
}
