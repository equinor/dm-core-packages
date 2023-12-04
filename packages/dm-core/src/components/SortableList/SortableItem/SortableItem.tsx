import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Icon } from '@equinor/eds-core-react'
import { drag_handle } from '@equinor/eds-icons'
import { SortableItemProps } from './types'

export const SortableItem = <T extends { key: string | number }>({
  children,
  item,
}: SortableItemProps<T>) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.key })

  const draggableStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return React.Children.only(
    React.cloneElement(children as React.ReactElement, {
      setNodeRef: setNodeRef,
      style: draggableStyle,
      dragHandle: () => (
        <Button
          ref={setActivatorNodeRef}
          variant="ghost_icon"
          style={{ cursor: "grab" }}
          {...listeners}
          {...attributes}
        >
          <Icon data={drag_handle} />
        </Button>
      ),
    })
  )
}
