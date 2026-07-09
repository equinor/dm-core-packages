import {
  DMApplicationProvider,
  DmssAPI,
  type TUiPluginMap,
} from '@development-framework/dm-core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import * as SiteDirectoryModule from '../SiteDirectoryPlugin'
import { SiteDirectoryPlugin } from '../SiteDirectoryPlugin'
import { SITE_TYPE_ADDRESS } from '../model/site'
import type { TSiteDirectoryConfig } from '../types/siteDirectory'

const wrapper = ({ children }: { children: ReactNode }) => (
  <DMApplicationProvider
    plugins={{} as TUiPluginMap}
    application={{ name: 'test', type: 'test' }}
    dmJobPath={''}
    enableBlueprintCache
  >
    {children}
  </DMApplicationProvider>
)

const renderDirectory = (config?: TSiteDirectoryConfig) =>
  render(
    <SiteDirectoryPlugin
      idReference='dmss://Sites/$root'
      type='test'
      config={config}
    />,
    { wrapper }
  )

const mockSearch = (data: Record<string, unknown>) =>
  jest
    .spyOn(DmssAPI.prototype, 'search')
    // biome-ignore lint/suspicious/noExplicitAny: test stub for AxiosPromise
    .mockResolvedValue({ data } as any)

const baseConfig: TSiteDirectoryConfig = {
  dataSources: ['Sites'],
  targetDataSource: 'Sites',
}

describe('SiteDirectoryPlugin', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('lists sites returned by search with an Open link to the viewer', async () => {
    const search = mockSearch({
      'Sites/marketing': { _id: 'marketing', name: 'Marketing site' },
      'Sites/docs': { _id: 'docs', name: 'Docs portal' },
    })

    renderDirectory(baseConfig)

    expect(await screen.findByText('Marketing site')).not.toBeNull()
    expect(screen.getByText('Docs portal')).not.toBeNull()

    // Searched for the fully-qualified Site type in the configured data source.
    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        dataSources: ['Sites'],
        body: { type: SITE_TYPE_ADDRESS },
      })
    )

    // Each card links to the default viewer URL for its entity ($ = root id).
    const openLinks = screen.getAllByRole('link')
    const hrefs = openLinks.map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('/view?documentId=dmss://Sites/$marketing')
    expect(hrefs).toContain('/view?documentId=dmss://Sites/$docs')
  })

  it('applies a custom viewUrlTemplate', async () => {
    mockSearch({ 'Sites/one': { _id: 'one', name: 'One' } })

    renderDirectory({ ...baseConfig, viewUrlTemplate: '/sites/{id}' })

    const link = await screen.findByRole('link')
    expect(link.getAttribute('href')).toBe('/sites/one')
  })

  it('shows an empty state when there are no sites', async () => {
    mockSearch({})

    renderDirectory(baseConfig)

    expect(await screen.findByText(/No websites yet/)).not.toBeNull()
  })

  it('shows an error state when search fails', async () => {
    jest
      .spyOn(DmssAPI.prototype, 'search')
      .mockRejectedValue(new Error('boom'))
    jest.spyOn(console, 'error').mockImplementation(() => {})

    renderDirectory(baseConfig)

    expect(await screen.findByText(/Could not load websites/)).not.toBeNull()
    expect(screen.getByRole('alert')).not.toBeNull()
  })

  it('creates a new site and navigates to it', async () => {
    mockSearch({})
    const documentAddSimple = jest
      .spyOn(DmssAPI.prototype, 'documentAddSimple')
      // biome-ignore lint/suspicious/noExplicitAny: test stub for AxiosPromise
      .mockResolvedValue({ data: 'fresh-id' } as any)

    const assign = jest
      .spyOn(SiteDirectoryModule, 'navigateTo')
      .mockImplementation(() => {})

    renderDirectory(baseConfig)

    const button = await screen.findByRole('button', { name: 'New site' })
    fireEvent.click(button)

    await waitFor(() => expect(documentAddSimple).toHaveBeenCalledTimes(1))

    const arg = documentAddSimple.mock.calls[0][0] as {
      dataSourceId: string
      // biome-ignore lint/suspicious/noExplicitAny: raw add body
      body: any
    }
    expect(arg.dataSourceId).toBe('Sites')
    // The raw endpoint stores verbatim, so the type must be fully-qualified.
    expect(arg.body.type).toBe(SITE_TYPE_ADDRESS)
    // Name is slugged (no spaces) with a unique suffix.
    expect(typeof arg.body.name).toBe('string')
    expect(arg.body.name).not.toContain(' ')
    expect(Array.isArray(arg.body.pages)).toBe(true)

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith(
        '/view?documentId=dmss://Sites/$fresh-id'
      )
    )
  })

  it('opens a freshly created site via newSiteUrlTemplate when set', async () => {
    mockSearch({})
    jest
      .spyOn(DmssAPI.prototype, 'documentAddSimple')
      // biome-ignore lint/suspicious/noExplicitAny: test stub for AxiosPromise
      .mockResolvedValue({ data: 'fresh-id' } as any)

    const assign = jest
      .spyOn(SiteDirectoryModule, 'navigateTo')
      .mockImplementation(() => {})

    renderDirectory({
      ...baseConfig,
      newSiteUrlTemplate:
        '/view?documentId=dmss://{dataSource}/${id}&recipe=Edit',
    })

    fireEvent.click(await screen.findByRole('button', { name: 'New site' }))

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith(
        '/view?documentId=dmss://Sites/$fresh-id&recipe=Edit'
      )
    )
  })

  it('shows the friendly title, a Draft badge, and a Show drafts toggle', async () => {
    mockSearch({
      'Sites/live': {
        _id: 'live',
        name: 'Live_Slug',
        title: 'Live Marketing Site',
        published: true,
      },
      'Sites/draft': { _id: 'draft', name: 'Draft_Slug', published: false },
    })

    renderDirectory(baseConfig)

    // Friendly title is preferred over the slug name.
    expect(await screen.findByText('Live Marketing Site')).not.toBeNull()
    // Draft site with no title falls back to its slug name.
    expect(screen.getByText('Draft_Slug')).not.toBeNull()
    // Only the unpublished site carries a Draft badge.
    expect(screen.getAllByText('Draft')).toHaveLength(1)

    // Turning off "Show drafts" hides the draft, leaving only the published one.
    const toggle = screen.getByLabelText('Show drafts') as HTMLInputElement
    expect(toggle.checked).toBe(true)
    fireEvent.click(toggle)

    await waitFor(() => expect(screen.queryByText('Draft_Slug')).toBeNull())
    expect(screen.getByText('Live Marketing Site')).not.toBeNull()
  })

  it('deletes a site after modal confirmation and removes the card', async () => {
    mockSearch({
      'Sites/alpha': { _id: 'alpha', name: 'Alpha', published: true },
      'Sites/beta': { _id: 'beta', name: 'Beta', published: true },
    })
    const documentRemove = jest
      .spyOn(DmssAPI.prototype, 'documentRemove')
      // biome-ignore lint/suspicious/noExplicitAny: test stub
      .mockResolvedValue({ data: undefined } as any)

    renderDirectory(baseConfig)

    expect(await screen.findByText('Alpha')).not.toBeNull()
    expect(screen.getByText('Beta')).not.toBeNull()

    // Click the trash icon — the modal should appear.
    const [firstTrash] = screen.getAllByRole('button', { name: 'Delete site' })
    fireEvent.click(firstTrash)
    expect(documentRemove).not.toHaveBeenCalled()

    // Modal shows the site name and a confirmation message.
    expect(screen.getByRole('dialog')).not.toBeNull()
    expect(screen.getByText(/permanent/i)).not.toBeNull()

    // Clicking "Delete" executes the deletion.
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(documentRemove).toHaveBeenCalledTimes(1))
    // The deleted card disappears from the list and the modal closes.
    await waitFor(() => expect(screen.queryByText('Alpha')).toBeNull())
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByText('Beta')).not.toBeNull()
  })

  it('cancels deletion when "No" is clicked in the modal', async () => {
    mockSearch({
      'Sites/one': { _id: 'one', name: 'One', published: true },
    })
    const documentRemove = jest
      .spyOn(DmssAPI.prototype, 'documentRemove')
      // biome-ignore lint/suspicious/noExplicitAny: test stub
      .mockResolvedValue({ data: undefined } as any)

    renderDirectory(baseConfig)

    await screen.findByText('One')
    fireEvent.click(screen.getByRole('button', { name: 'Delete site' }))
    expect(screen.getByRole('dialog')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(documentRemove).not.toHaveBeenCalled()
    expect(screen.getByText('One')).not.toBeNull()
  })
})
