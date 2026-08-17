import {
  DMApplicationProvider,
  DmssAPI,
  createSaveCoordinatorStore,
  SaveAnchorBoundary,
  SaveCoordinatorProvider,
  type TUiPluginMap,
} from '@development-framework/dm-core'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { ListPlugin } from './ListPlugin'

// jsdom doesn't implement the native Popover API that EDS's Tooltip relies on.
if (!HTMLElement.prototype.showPopover) {
  HTMLElement.prototype.showPopover = jest.fn()
  HTMLElement.prototype.hidePopover = jest.fn()
  HTMLElement.prototype.togglePopover = jest.fn()
}

// Intercepts the onSubmit callback ListPlugin passes to a row's expanded/nested
// view, so we can simulate "a nested row-level Form just saved" without having
// to mock the full nested blueprint/recipe resolution chain.
let capturedOnSubmit: ((data: unknown) => void) | undefined
jest.mock('@development-framework/dm-core', () => {
  const actual = jest.requireActual('@development-framework/dm-core')
  return {
    ...actual,
    ViewCreator: (props: any) => {
      capturedOnSubmit = props.onSubmit
      return null
    },
  }
})

const plugins = {
  '@development-framework/dm-core-plugins/list': { component: ListPlugin },
} as TUiPluginMap

const withApplication = (children: React.ReactNode) => (
  <DMApplicationProvider
    plugins={plugins}
    application={{ name: 'test', type: 'test' }}
    dmJobPath={''}
    enableBlueprintCache
  >
    {children}
  </DMApplicationProvider>
)

const mockContainedList = (items: Array<Record<string, unknown>>) => {
  jest
    .spyOn(DmssAPI.prototype, 'attributeGet')
    .mockResolvedValue({ data: { attribute: { contained: true } } } as any)
  jest
    .spyOn(DmssAPI.prototype, 'documentGet')
    .mockResolvedValue({ data: items } as any)
  return jest
    .spyOn(DmssAPI.prototype, 'documentUpdate')
    .mockResolvedValue({ data: items } as any)
}

describe('ListPlugin + SaveCoordinator', () => {
  afterEach(() => {
    jest.clearAllMocks()
    capturedOnSubmit = undefined
  })

  it('marks the coordinator entry dirty synchronously when a nested row view reports an update - not only after its own re-render', async () => {
    mockContainedList([{ name: 'Alpha', key: 'alpha' }])
    const store = createSaveCoordinatorStore()

    const { getByTestId } = render(
      withApplication(
        <SaveCoordinatorProvider value={store}>
          <SaveAnchorBoundary>
            <ListPlugin
              idReference='ds/$1.items'
              type='Root'
              config={{ headers: ['name'] } as any}
            />
          </SaveAnchorBoundary>
        </SaveCoordinatorProvider>
      )
    )

    const expandButton = await waitFor(() => getByTestId('expandListItem-0'))
    fireEvent.click(expandButton)

    await waitFor(() => expect(capturedOnSubmit).toBeDefined())

    expect(store.getSnapshot()).toBe(false)

    act(() => {
      capturedOnSubmit!({ name: 'Alpha renamed' })
    })

    // Must be true IMMEDIATELY (synchronously) - not just eventually after a
    // React re-render/effect round-trip - so an ancestor's saveAll() called
    // right after can never miss this newly-dirtied entry.
    expect(store.getSnapshot()).toBe(true)
  })
})
