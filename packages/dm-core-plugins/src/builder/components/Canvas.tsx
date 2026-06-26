import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { Button, Icon } from '@equinor/eds-core-react'
import { type PointerEvent as ReactPointerEvent, useRef } from 'react'
import type { TGridArea, TGridItem } from '../../grid/types'
import { getBlock } from '../blocks'
import { pixelDeltaToCells } from '../gridMetrics'
import { ICONS } from '../icons'
import * as Styled from '../styles'
import type { TBuilderModel } from '../types'

type TGridMetrics = { size: TBuilderModel['size']; rect: () => DOMRect | null }

const CanvasItem = ({
  item,
  index,
  selected,
  metrics,
  onSelect,
  onDelete,
  onDuplicate,
  onResize,
}: {
  item: TGridItem
  index: number
  selected: boolean
  metrics: TGridMetrics
  onSelect: (index: number) => void
  onDelete: (index: number) => void
  onDuplicate: (index: number) => void
  onResize: (index: number, area: TGridArea) => void
}) => {
  const recipe = item.viewConfig.recipe
  const blockId = typeof recipe === 'string' ? recipe : recipe?.name
  const block = getBlock(String(blockId))
  const { gridArea } = item

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `item:${index}`, data: { type: 'canvas-item', index } })

  // Live resize via native pointer events on the corner handle. Kept separate
  // from dnd-kit (which owns moving) so the two gestures never conflict.
  const resizeOrigin = useRef<TGridArea | null>(null)
  const resizeStart = useRef<{ x: number; y: number } | null>(null)

  const handleResizePointerDown = (event: ReactPointerEvent) => {
    event.preventDefault()
    event.stopPropagation()
    resizeOrigin.current = gridArea
    resizeStart.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleResizePointerMove = (event: ReactPointerEvent) => {
    const origin = resizeOrigin.current
    const start = resizeStart.current
    const rect = metrics.rect()
    if (!origin || !start || !rect) return
    const delta = pixelDeltaToCells(
      { x: event.clientX - start.x, y: event.clientY - start.y },
      rect,
      metrics.size
    )
    onResize(index, {
      columnStart: origin.columnStart,
      rowStart: origin.rowStart,
      columnEnd: origin.columnEnd + delta.columns,
      rowEnd: origin.rowEnd + delta.rows,
    })
  }

  const handleResizePointerUp = (event: ReactPointerEvent) => {
    resizeOrigin.current = null
    resizeStart.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <Styled.CanvasItem
      ref={setNodeRef}
      $selected={selected}
      $dragging={isDragging}
      style={{
        gridArea: `${gridArea.rowStart} / ${gridArea.columnStart} / ${
          gridArea.rowEnd + 1
        } / ${gridArea.columnEnd + 1}`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(index)
      }}
    >
      <Styled.CanvasItemHeader {...listeners} {...attributes}>
        <span>
          {block && (
            <Icon
              data={ICONS[block.icon]}
              size={16}
              style={{ marginRight: 4, verticalAlign: 'middle' }}
            />
          )}
          {item.title ?? block?.label ?? 'Widget'}
        </span>
        <Styled.CanvasItemActions>
          <Button
            variant='ghost_icon'
            aria-label='Duplicate widget'
            onClick={(event) => {
              event.stopPropagation()
              onDuplicate(index)
            }}
          >
            <Icon data={ICONS.copy} size={16} />
          </Button>
          <Button
            variant='ghost_icon'
            aria-label='Delete widget'
            onClick={(event) => {
              event.stopPropagation()
              onDelete(index)
            }}
          >
            <Icon data={ICONS.delete_to_trash} size={16} />
          </Button>
        </Styled.CanvasItemActions>
      </Styled.CanvasItemHeader>
      <Styled.CanvasItemBody>{block?.description}</Styled.CanvasItemBody>
      <Styled.ResizeHandle
        aria-label='Resize widget'
        onClick={(event) => event.stopPropagation()}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
      />
    </Styled.CanvasItem>
  )
}

export const Canvas = ({
  model,
  selectedIndex,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
  onResize,
}: {
  model: TBuilderModel
  selectedIndex: number | null
  onSelect: (index: number | null) => void
  onDelete: (index: number) => void
  onDuplicate: (index: number) => void
  onMove: (index: number, deltaColumns: number, deltaRows: number) => void
  onResize: (index: number, area: TGridArea) => void
}): React.ReactElement => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Translate a finished canvas-item drag (pixels) into a grid cell move.
  useDndMonitor({
    onDragEnd(event) {
      const data = event.active.data.current
      if (data?.type !== 'canvas-item') return
      const rect = gridRef.current?.getBoundingClientRect()
      if (!rect) return
      const delta = pixelDeltaToCells(event.delta, rect, model.size)
      if (delta.columns !== 0 || delta.rows !== 0) {
        onMove(data.index as number, delta.columns, delta.rows)
      }
    },
  })

  const metrics: TGridMetrics = {
    size: model.size,
    rect: () => gridRef.current?.getBoundingClientRect() ?? null,
  }

  return (
    <Styled.CanvasPanel onClick={() => onSelect(null)}>
      <Styled.CanvasGrid
        ref={(node) => {
          setNodeRef(node)
          gridRef.current = node
        }}
        $size={model.size}
        $editing
        style={{ outline: isOver ? '2px dashed #007079' : 'none' }}
      >
        {model.items.length === 0 && (
          <Styled.EmptyState>
            Drag a widget here, or click one in the palette, to start building
            your page.
          </Styled.EmptyState>
        )}
        {model.items.map((item, index) => (
          <CanvasItem
            key={index}
            item={item}
            index={index}
            selected={selectedIndex === index}
            metrics={metrics}
            onSelect={onSelect}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onResize={onResize}
          />
        ))}
      </Styled.CanvasGrid>
    </Styled.CanvasPanel>
  )
}
