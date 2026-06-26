import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { Button, Icon } from '@equinor/eds-core-react'
import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useRef,
} from 'react'
import type { TGridArea, TGridItem } from '../../grid/types'
import { getBlock } from '../blocks'
import { pixelDeltaToCells } from '../gridMetrics'
import { ICONS } from '../icons'
import { isContainerItem } from '../model'
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
  onResizeEnd,
  onEnter,
}: {
  item: TGridItem
  index: number
  selected: boolean
  metrics: TGridMetrics
  onSelect: (index: number) => void
  onDelete: (index: number) => void
  onDuplicate: (index: number) => void
  onResize: (index: number, area: TGridArea) => void
  onResizeEnd: () => void
  onEnter: (index: number) => void
}) => {
  const recipe = item.viewConfig.recipe
  const blockId = typeof recipe === 'string' ? recipe : recipe?.name
  const block = getBlock(String(blockId))
  const isContainer = isContainerItem(item)
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
    const wasResizing = resizeOrigin.current !== null
    resizeOrigin.current = null
    resizeStart.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (wasResizing) onResizeEnd()
  }

  const childCount =
    isContainer && typeof recipe === 'object'
      ? (recipe?.config?.items?.length ?? 0)
      : 0

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
      onDoubleClick={(event) => {
        if (!isContainer) return
        event.stopPropagation()
        onEnter(index)
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
          {isContainer && (
            <Button
              variant='ghost_icon'
              aria-label='Open section'
              onClick={(event) => {
                event.stopPropagation()
                onEnter(index)
              }}
            >
              <Icon data={ICONS.chevron_right} size={16} />
            </Button>
          )}
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
      <Styled.CanvasItemBody>
        {isContainer
          ? `${childCount} widget${childCount === 1 ? '' : 's'} — double-click or open to edit`
          : block?.description}
      </Styled.CanvasItemBody>
      <Styled.ResizeHandle
        aria-label='Resize widget'
        onClick={(event) => event.stopPropagation()}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerUp}
      />
    </Styled.CanvasItem>
  )
}

export const Canvas = ({
  model,
  selectedIndex,
  frameWidth,
  breadcrumb,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
  onResize,
  onResizeEnd,
  onEnter,
}: {
  model: TBuilderModel
  selectedIndex: number | null
  frameWidth: string
  breadcrumb?: ReactNode
  onSelect: (index: number | null) => void
  onDelete: (index: number) => void
  onDuplicate: (index: number) => void
  onMove: (index: number, deltaColumns: number, deltaRows: number) => void
  onResize: (index: number, area: TGridArea) => void
  onResizeEnd: () => void
  onEnter: (index: number) => void
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
      {breadcrumb}
      <Styled.DeviceFrame $maxWidth={frameWidth}>
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
              onResizeEnd={onResizeEnd}
              onEnter={onEnter}
            />
          ))}
        </Styled.CanvasGrid>
      </Styled.DeviceFrame>
    </Styled.CanvasPanel>
  )
}
