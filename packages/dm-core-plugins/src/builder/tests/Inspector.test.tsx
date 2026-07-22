import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getBlock } from '../model/blocks'
import { Inspector, type TInspectorHandlers } from '../components/Inspector'
import { addWidget, createEmptyModel } from '../model/model'

const itemForBlock = (blockId: string) => {
  const block = getBlock(blockId)
  if (!block) throw new Error(`missing block ${blockId}`)
  const model = addWidget(createEmptyModel(), block)
  return { item: model.items[0], block }
}

const handlers = (): TInspectorHandlers => ({
  onTitle: jest.fn(),
  onLabel: jest.fn(),
  onScope: jest.fn(),
  onArea: jest.fn(),
  onConfigValue: jest.fn(),
  onStyleValue: jest.fn(),
  onCommit: jest.fn(),
})

const gridSize = createEmptyModel().size

describe('Inspector', () => {
  it('prompts to select a widget when none is active', () => {
    render(
      <Inspector
        item={null}
        block={undefined}
        gridSize={gridSize}
        dataSource=''
        {...handlers()}
      />
    )
    expect(
      screen.getByText('Select a widget on the canvas to edit its properties.')
    ).not.toBeNull()
  })

  it('edits the title', async () => {
    const user = userEvent.setup()
    const h = handlers()
    const { item, block } = itemForBlock('text')
    render(
      <Inspector
        item={item}
        block={block}
        gridSize={gridSize}
        dataSource=''
        {...h}
      />
    )

    await user.type(screen.getByLabelText('Title'), '!')
    expect(h.onTitle).toHaveBeenCalled()
  })

  it('edits the scope / data binding', async () => {
    const user = userEvent.setup()
    const h = handlers()
    const { item, block } = itemForBlock('text')
    render(
      <Inspector
        item={item}
        block={block}
        gridSize={gridSize}
        dataSource=''
        {...h}
      />
    )

    await user.type(screen.getByLabelText('Scope'), 'orders')
    expect(h.onScope).toHaveBeenCalled()
  })

  it('routes a block config field edit to onConfigValue', async () => {
    const user = userEvent.setup()
    const h = handlers()
    // The Text block exposes a "Content" config field (target key `content`).
    const { item, block } = itemForBlock('text')
    render(
      <Inspector
        item={item}
        block={block}
        gridSize={gridSize}
        dataSource=''
        {...h}
      />
    )

    await user.type(screen.getByLabelText('Content'), 'x')
    expect(h.onConfigValue).toHaveBeenCalledWith('content', expect.any(String))
  })

  it('updates the grid area from the layout fields', () => {
    const h = handlers()
    const { item, block } = itemForBlock('text')
    render(
      <Inspector
        item={item}
        block={block}
        gridSize={gridSize}
        dataSource=''
        {...h}
      />
    )

    fireEvent.change(screen.getByLabelText('Width'), { target: { value: '4' } })
    expect(h.onArea).toHaveBeenCalled()
  })

  it('commits (ends the undo run) on blur', () => {
    const h = handlers()
    const { item, block } = itemForBlock('text')
    const { container } = render(
      <Inspector
        item={item}
        block={block}
        gridSize={gridSize}
        dataSource=''
        {...h}
      />
    )

    fireEvent.blur(screen.getByLabelText('Title'), { relatedTarget: container })
    expect(h.onCommit).toHaveBeenCalled()
  })
})
