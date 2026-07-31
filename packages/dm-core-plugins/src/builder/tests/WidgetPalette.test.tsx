import { DndContext } from '@dnd-kit/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { BLOCKS } from '../model/blocks'
import { WidgetPalette } from '../components/WidgetPalette'

const renderPalette = (onAdd: (block: unknown) => void) =>
  render(
    <DndContext>
      <WidgetPalette onAdd={onAdd} />
    </DndContext>
  )

describe('WidgetPalette', () => {
  it('renders a card for every registered block', () => {
    renderPalette(() => {})
    for (const block of BLOCKS) {
      expect(screen.getByRole('button', { name: block.label })).not.toBeNull()
    }
  })

  it('groups blocks under their category headings', () => {
    renderPalette(() => {})
    // Every block declares one of these categories; at least Layout/Content exist.
    expect(screen.getByText('Layout')).not.toBeNull()
    expect(screen.getByText('Content')).not.toBeNull()
  })

  it('calls onAdd with the block when a card is clicked', async () => {
    const onAdd = jest.fn()
    renderPalette(onAdd)

    const section = BLOCKS.find((block) => block.id === 'section')
    if (!section) throw new Error('section block missing')
    // Click directly: dnd-kit draggable listeners intercept the pointer
    // sequence user-event emits, but the card's onClick still fires on click.
    fireEvent.click(screen.getByRole('button', { name: section.label }))

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(section)
  })
})
