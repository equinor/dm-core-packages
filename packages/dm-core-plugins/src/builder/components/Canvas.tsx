import { useDroppable } from '@dnd-kit/core'
import { Button, Icon } from '@equinor/eds-core-react'
import type { TGridItem } from '../../grid/types'
import { getBlock } from '../blocks'
import { ICONS } from '../icons'
import * as Styled from '../styles'
import type { TBuilderModel } from '../types'

const CanvasItem = ({
  item,
  index,
  selected,
  onSelect,
  onDelete,
}: {
  item: TGridItem
  index: number
  selected: boolean
  onSelect: (index: number) => void
  onDelete: (index: number) => void
}) => {
  const recipe = item.viewConfig.recipe
  const blockId = typeof recipe === 'string' ? recipe : recipe?.name
  const block = getBlock(String(blockId))
  const { gridArea } = item
  return (
    <Styled.CanvasItem
      $selected={selected}
      style={{
        gridArea: `${gridArea.rowStart} / ${gridArea.columnStart} / ${
          gridArea.rowEnd + 1
        } / ${gridArea.columnEnd + 1}`,
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(index)
      }}
    >
      <Styled.CanvasItemHeader>
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
      </Styled.CanvasItemHeader>
      <Styled.CanvasItemBody>{block?.description}</Styled.CanvasItemBody>
    </Styled.CanvasItem>
  )
}

export const Canvas = ({
  model,
  selectedIndex,
  onSelect,
  onDelete,
}: {
  model: TBuilderModel
  selectedIndex: number | null
  onSelect: (index: number | null) => void
  onDelete: (index: number) => void
}): React.ReactElement => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })

  return (
    <Styled.CanvasPanel onClick={() => onSelect(null)}>
      <Styled.CanvasGrid
        ref={setNodeRef}
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
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </Styled.CanvasGrid>
    </Styled.CanvasPanel>
  )
}
