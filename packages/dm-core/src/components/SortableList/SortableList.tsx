import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { SortableListProps } from './types'

export const SortableList = ({ items, children }: SortableListProps) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  )
}
