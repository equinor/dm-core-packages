import React from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { SortableListProps } from './types'

export const SortableList = <T extends { id: string | number }>({
  items,
  children,
  onReorder,
}: SortableListProps<T>) => {
  const dragAndDropSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  function handleDragAndDrop(event: DragEndEvent) {
    const { active, over } = event
    const itemIds = items.map((item) => item.id)

    const oldIndex = itemIds.indexOf(active.id)
    const newIndex = over ? itemIds.indexOf(over?.id) : -1
    const updatedItems =
      newIndex !== -1 ? arrayMove(items, oldIndex, newIndex) : items
    onReorder(updatedItems)
  }

  return (
    <DndContext
      sensors={dragAndDropSensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragAndDrop}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
