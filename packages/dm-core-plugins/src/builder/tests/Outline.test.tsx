import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getBlock } from '../model/blocks'
import { Outline } from '../components/Outline'
import { addWidget, createEmptyModel } from '../model/model'

const modelWith = (...blockIds: string[]) =>
  blockIds.reduce((model, id) => {
    const block = getBlock(id)
    if (!block) throw new Error(`missing block ${id}`)
    return addWidget(model, block)
  }, createEmptyModel())

describe('Outline', () => {
  const noop = () => {}

  it('shows an empty hint when there are no widgets', () => {
    render(
      <Outline items={[]} selectedIndex={null} onSelect={noop} onEnter={noop} />
    )
    expect(screen.getByText('No widgets on this page yet.')).not.toBeNull()
  })

  it('lists a row per widget and selects on click', async () => {
    const user = userEvent.setup()
    const model = modelWith('heading', 'text')
    const onSelect = jest.fn()
    render(
      <Outline
        items={model.items}
        selectedIndex={null}
        onSelect={onSelect}
        onEnter={noop}
      />
    )

    await user.click(screen.getByText('Text'))
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('opens a container section via its Open button without selecting', async () => {
    const user = userEvent.setup()
    const model = modelWith('section')
    const onSelect = jest.fn()
    const onEnter = jest.fn()
    render(
      <Outline
        items={model.items}
        selectedIndex={null}
        onSelect={onSelect}
        onEnter={onEnter}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Open section' }))
    expect(onEnter).toHaveBeenCalledWith(0)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
