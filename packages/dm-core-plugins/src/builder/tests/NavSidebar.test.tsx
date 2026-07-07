import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavSidebar } from '../components/NavSidebar'
import { createPage, type TBuilderPage } from '../model/site'

/** Build a small page tree: Home, About (with a Team sub-page), Contact. */
const buildPages = (): TBuilderPage[] => {
  const home = createPage('Home')
  const about = createPage('About')
  const team = createPage('Team')
  about.children = [team]
  const contact = createPage('Contact')
  return [home, about, contact]
}

const noop = () => {}

const baseProps = (pages: TBuilderPage[]) => ({
  pages,
  activePageId: pages[0].id,
  editing: true,
  onNavigate: noop,
  onAddPage: noop,
  onRenamePage: noop,
  onDeletePage: noop,
  onReorder: noop,
})

describe('NavSidebar', () => {
  it('navigates to a page when its row is clicked', async () => {
    const user = userEvent.setup()
    const pages = buildPages()
    const onNavigate = jest.fn()
    render(<NavSidebar {...baseProps(pages)} onNavigate={onNavigate} />)

    await user.click(screen.getByText('Contact'))

    expect(onNavigate).toHaveBeenCalledWith(pages[2].id)
  })

  it('adds a top-level page from the footer button', async () => {
    const user = userEvent.setup()
    const pages = buildPages()
    const onAddPage = jest.fn()
    render(<NavSidebar {...baseProps(pages)} onAddPage={onAddPage} />)

    await user.click(screen.getByRole('button', { name: 'Add page' }))

    expect(onAddPage).toHaveBeenCalledWith(null)
  })

  it('adds a sub-page under a specific page', async () => {
    const user = userEvent.setup()
    const pages = buildPages()
    const onAddPage = jest.fn()
    render(<NavSidebar {...baseProps(pages)} onAddPage={onAddPage} />)

    await user.click(
      screen.getByRole('button', { name: 'Add sub-page to About' })
    )

    expect(onAddPage).toHaveBeenCalledWith(pages[1].id)
  })

  it('renames a page inline and commits on Enter', async () => {
    const user = userEvent.setup()
    const pages = buildPages()
    const onRenamePage = jest.fn()
    render(<NavSidebar {...baseProps(pages)} onRenamePage={onRenamePage} />)

    await user.click(screen.getByRole('button', { name: 'Rename Home' }))
    const input = screen.getByDisplayValue('Home')
    await user.clear(input)
    await user.type(input, 'Landing{Enter}')

    expect(onRenamePage).toHaveBeenCalledWith(pages[0].id, 'Landing')
  })

  it('does not rename when the draft is cleared to whitespace', async () => {
    const user = userEvent.setup()
    const pages = buildPages()
    const onRenamePage = jest.fn()
    render(<NavSidebar {...baseProps(pages)} onRenamePage={onRenamePage} />)

    await user.click(screen.getByRole('button', { name: 'Rename Home' }))
    const input = screen.getByDisplayValue('Home')
    await user.clear(input)
    await user.type(input, '   {Enter}')

    expect(onRenamePage).not.toHaveBeenCalled()
  })

  it('deletes a page', async () => {
    const user = userEvent.setup()
    const pages = buildPages()
    const onDeletePage = jest.fn()
    render(<NavSidebar {...baseProps(pages)} onDeletePage={onDeletePage} />)

    await user.click(screen.getByRole('button', { name: 'Delete Contact' }))

    expect(onDeletePage).toHaveBeenCalledWith(pages[2].id)
  })

  it('hides delete for the only remaining top-level page', () => {
    const pages = [createPage('Home')]
    render(<NavSidebar {...baseProps(pages)} />)

    expect(
      screen.queryByRole('button', { name: 'Delete Home' })
    ).toBeNull()
  })

  it('collapses and expands a page with children', async () => {
    const user = userEvent.setup()
    const pages = buildPages()
    render(<NavSidebar {...baseProps(pages)} />)

    // Team (child of About) is visible while expanded.
    expect(screen.getByText('Team')).not.toBeNull()

    await user.click(screen.getByRole('button', { name: 'Collapse' }))
    expect(screen.queryByText('Team')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Expand' }))
    expect(screen.getByText('Team')).not.toBeNull()
  })

  it('renders a read-only menu without editing affordances in preview', () => {
    const pages = buildPages()
    render(<NavSidebar {...baseProps(pages)} editing={false} />)

    expect(screen.getByText('Menu')).not.toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Add page' })
    ).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Rename Home' })
    ).toBeNull()
  })

  it('reorders siblings via drag and drop within the same level', () => {
    const pages = buildPages()
    const onReorder = jest.fn()
    render(<NavSidebar {...baseProps(pages)} onReorder={onReorder} />)

    const homeHandle = screen.getByLabelText('Reorder Home')
    const contactRow = screen.getByText('Contact').closest('div') as HTMLElement

    fireEvent.dragStart(homeHandle)
    fireEvent.dragOver(contactRow)
    fireEvent.drop(contactRow)

    expect(onReorder).toHaveBeenCalledWith(null, 0, 2)
  })
})
