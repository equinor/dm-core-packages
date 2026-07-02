import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '../components/Navbar'
import {
  createDefaultNavbar,
  createPage,
  type TBuilderPage,
  type TNavbar,
} from '../site'

const pages: TBuilderPage[] = [createPage('Home'), createPage('About')]

const enabledNavbar = (overrides: Partial<TNavbar> = {}): TNavbar => ({
  ...createDefaultNavbar(),
  enabled: true,
  items: [
    { id: 'nav-1', label: 'Home', target: { kind: 'page', pageId: pages[0].id } },
  ],
  ...overrides,
})

const noop = () => {}

const baseProps = (navbar: TNavbar) => ({
  navbar,
  pages,
  editing: true,
  onNavigate: noop,
  onUpdateNavbar: noop,
  onAddItem: noop,
  onUpdateItem: noop,
  onRemoveItem: noop,
  onReorderItem: noop,
})

describe('Navbar', () => {
  it('renders an opt-in affordance while disabled in edit mode', async () => {
    const user = userEvent.setup()
    const onUpdateNavbar = jest.fn()
    render(
      <Navbar
        {...baseProps(createDefaultNavbar())}
        onUpdateNavbar={onUpdateNavbar}
      />
    )

    await user.click(screen.getByRole('button', { name: /Add a top navbar/i }))
    expect(onUpdateNavbar).toHaveBeenCalledWith({ enabled: true })
  })

  it('renders nothing when disabled in preview mode', () => {
    const { container } = render(
      <Navbar {...baseProps(createDefaultNavbar())} editing={false} />
    )
    expect(container.textContent).toBe('')
  })

  it('adds a link', async () => {
    const user = userEvent.setup()
    const onAddItem = jest.fn()
    render(<Navbar {...baseProps(enabledNavbar())} onAddItem={onAddItem} />)

    await user.click(screen.getByRole('button', { name: /Add link/i }))
    expect(onAddItem).toHaveBeenCalledTimes(1)
  })

  it('renames a link inline and commits on Enter', async () => {
    const user = userEvent.setup()
    const onUpdateItem = jest.fn()
    render(<Navbar {...baseProps(enabledNavbar())} onUpdateItem={onUpdateItem} />)

    await user.click(screen.getByRole('button', { name: 'Home' }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Start{Enter}')

    expect(onUpdateItem).toHaveBeenCalledWith('nav-1', { label: 'Start' })
  })

  it('retargets a link to another page', async () => {
    const onUpdateItem = jest.fn()
    render(<Navbar {...baseProps(enabledNavbar())} onUpdateItem={onUpdateItem} />)

    const select = screen.getByLabelText('Target for Home')
    fireEvent.change(select, { target: { value: pages[1].id } })

    expect(onUpdateItem).toHaveBeenCalledWith('nav-1', {
      target: { kind: 'page', pageId: pages[1].id },
    })
  })

  it('switches a link to an external URL target', async () => {
    const onUpdateItem = jest.fn()
    render(<Navbar {...baseProps(enabledNavbar())} onUpdateItem={onUpdateItem} />)

    const select = screen.getByLabelText('Target for Home')
    fireEvent.change(select, { target: { value: '__url__' } })

    expect(onUpdateItem).toHaveBeenCalledWith('nav-1', {
      target: { kind: 'url', href: '' },
    })
  })

  it('deletes a link', async () => {
    const user = userEvent.setup()
    const onRemoveItem = jest.fn()
    render(<Navbar {...baseProps(enabledNavbar())} onRemoveItem={onRemoveItem} />)

    await user.click(screen.getByRole('button', { name: 'Delete Home' }))
    expect(onRemoveItem).toHaveBeenCalledWith('nav-1')
  })

  it('edits the brand inline', async () => {
    const user = userEvent.setup()
    const onUpdateNavbar = jest.fn()
    render(
      <Navbar {...baseProps(enabledNavbar())} onUpdateNavbar={onUpdateNavbar} />
    )

    await user.click(screen.getByText('My Site'))
    const input = screen.getByDisplayValue('My Site')
    await user.clear(input)
    await user.type(input, 'Acme{Enter}')

    expect(onUpdateNavbar).toHaveBeenCalledWith({ brand: 'Acme' })
  })

  it('navigates when a preview link is clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = jest.fn()
    render(
      <Navbar
        {...baseProps(enabledNavbar())}
        editing={false}
        onNavigate={onNavigate}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Home' }))
    expect(onNavigate).toHaveBeenCalledWith(pages[0].id)
  })
})
