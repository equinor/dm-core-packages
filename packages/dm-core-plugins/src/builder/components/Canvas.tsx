import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { Button, Icon } from '@equinor/eds-core-react'
import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
} from 'react'
import type { TGridArea, TGridItem } from '../../grid/types'
import { getBlock } from '../model/blocks'
import { isContainerItem } from '../model/model'
import * as Styled from '../styles'
import type { TBuilderModel } from '../types'
import { pixelDeltaToCells } from '../utils/gridMetrics'
import { ICONS } from '../utils/icons'

type TGridMetrics = { size: TBuilderModel['size']; rect: () => DOMRect | null }

/** Multiplicative density step for one zoom increment (in/out). */
export const DENSITY_STEP = 1.5

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

  const bodyText =
    typeof recipe === 'object' && typeof recipe?.config?.content === 'string'
      ? recipe.config.content
      : undefined

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
        <Styled.CanvasItemActions
          onPointerDown={(event) => event.stopPropagation()}
        >
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
      <Styled.CanvasItemBody
        style={{
          flexDirection: 'column',
          alignItems:
            item.style?.textAlign === 'center'
              ? 'center'
              : item.style?.textAlign === 'right'
                ? 'flex-end'
                : item.style?.textAlign === 'left'
                  ? 'flex-start'
                  : 'stretch',
          justifyContent:
            item.style?.verticalAlign === 'center'
              ? 'center'
              : item.style?.verticalAlign === 'bottom'
                ? 'flex-end'
                : item.style?.verticalAlign === 'top'
                  ? 'flex-start'
                  : isContainer
                    ? 'center'
                    : 'flex-start',
        }}
      >
        {isContainer ? (
          `${childCount} widget${childCount === 1 ? '' : 's'} — double-click or open to edit`
        ) : (
          <>
            {item.title && !block?.hideTitle && (
              <div
                style={{
                  textAlign: item.titleStyle?.textAlign,
                  fontSize: item.titleStyle?.fontSize ?? '18px',
                  fontWeight: item.titleStyle?.bold ? 700 : 600,
                  color: item.titleStyle?.color ?? '#111',
                  padding: item.titleStyle?.padding,
                }}
              >
                {item.title}
              </div>
            )}
            <div
              style={{
                textAlign: item.style?.textAlign,
                fontSize: item.style?.fontSize,
                fontWeight: item.style?.bold ? 700 : undefined,
                color: item.style?.color,
                padding: item.style?.padding,
              }}
            >
              {bodyText ?? block?.description}
            </div>
          </>
        )}
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
  onDensity,
  nav,
  navbar,
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
  onDensity: (factor: number) => void
  nav?: ReactNode
  navbar?: ReactNode
}): React.ReactElement => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })
  const gridRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

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

  // Ctrl/Cmd + wheel adjusts grid density (zoom). A native, non-passive
  // listener is required so we can call preventDefault to suppress page zoom.
  // Wheel deltas are accumulated so trackpads take one density step per gesture
  // chunk rather than dozens.
  useEffect(() => {
    const node = panelRef.current
    if (!node) return
    let accumulated = 0
    const THRESHOLD = 40
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      accumulated += event.deltaY
      while (accumulated <= -THRESHOLD) {
        accumulated += THRESHOLD
        onDensity(DENSITY_STEP)
      }
      while (accumulated >= THRESHOLD) {
        accumulated -= THRESHOLD
        onDensity(1 / DENSITY_STEP)
      }
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [onDensity])

  const metrics: TGridMetrics = {
    size: model.size,
    rect: () => gridRef.current?.getBoundingClientRect() ?? null,
  }

  return (
    <Styled.CanvasPanel ref={panelRef} onClick={() => onSelect(null)}>
      {breadcrumb}
      <Styled.SiteShell>
        {navbar}
        <Styled.SiteFrame>
          {nav}
          <Styled.SitePageArea>
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
                    Drag a widget here, or click one in the palette, to start
                    building your page.
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
          </Styled.SitePageArea>
        </Styled.SiteFrame>
      </Styled.SiteShell>
    </Styled.CanvasPanel>
  )
}
