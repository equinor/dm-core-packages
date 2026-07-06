import {
  DMApplicationProvider,
  DmssAPI,
  type TUiPluginMap,
} from '@development-framework/dm-core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SiteDirectoryPlugin } from '../SiteDirectoryPlugin'
import { SITE_TYPE_ADDRESS } from '../site'
import type { TSiteDirectoryConfig } from '../siteDirectory.types'

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

    const assign = jest.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { assign },
    })

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

  it('hides the New site button when creation is disabled', async () => {
    mockSearch({})

    renderDirectory({ ...baseConfig, allowCreate: false })

    // Wait for load to finish so the button would have appeared if enabled.
    await screen.findByText(/No websites yet/)
    expect(screen.queryByRole('button', { name: 'New site' })).toBeNull()
  })
})
