import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { SortableContextProps } from './types'

export const SortableContext = <T extends { key: string | number }>({
  items,
  children,
  onReorder,
}: SortableContextProps<T>) => {
  const dragAndDropSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragAndDrop(event: DragEndEvent) {
    const { active, over } = event
    const itemIds = items.map((item) => item.key)

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
      {children}
    </DndContext>
  )
}
