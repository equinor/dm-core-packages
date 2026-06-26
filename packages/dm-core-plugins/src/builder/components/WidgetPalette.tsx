import { useDraggable } from '@dnd-kit/core'
import { Icon, Typography } from '@equinor/eds-core-react'
import { BLOCKS } from '../blocks'
import { ICONS } from '../icons'
import * as Styled from '../styles'
import type { TBlock, TBlockCategory } from '../types'

const CATEGORY_LABELS: Record<TBlockCategory, string> = {
  layout: 'Layout',
  content: 'Content',
  media: 'Media',
  data: 'Data',
}

const PaletteCard = ({
  block,
  onAdd,
}: {
  block: TBlock
  onAdd: (block: TBlock) => void
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${block.id}`,
    data: { blockId: block.id },
  })

  return (
    <Styled.PaletteCard
      ref={setNodeRef}
      type='button'
      title={block.description}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      onClick={() => onAdd(block)}
      {...listeners}
      {...attributes}
    >
      <Icon data={ICONS[block.icon]} size={18} />
      {block.label}
    </Styled.PaletteCard>
  )
}

export const WidgetPalette = ({
  onAdd,
}: {
  onAdd: (block: TBlock) => void
}): React.ReactElement => {
  const categories = Array.from(
    new Set(BLOCKS.map((block) => block.category))
  ) as TBlockCategory[]

  return (
    <Styled.PalettePanel>
      <Typography variant='h6'>Widgets</Typography>
      {categories.map((category) => (
        <div key={category}>
          <Styled.PaletteGroupTitle>
            {CATEGORY_LABELS[category]}
          </Styled.PaletteGroupTitle>
          {BLOCKS.filter((block) => block.category === category).map(
            (block) => (
              <PaletteCard key={block.id} block={block} onAdd={onAdd} />
            )
          )}
        </div>
      ))}
    </Styled.PalettePanel>
  )
}
