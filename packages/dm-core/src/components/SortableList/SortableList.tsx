import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { SortableListProps } from './types'

export const SortableList = <T extends { id: string | number }>({
  items,
  children,
}: SortableListProps<T>) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  )
}
