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
import { TablePlugin } from './TablePlugin'

// jsdom doesn't implement the native Popover API that EDS's Tooltip relies on.
if (!HTMLElement.prototype.showPopover) {
  HTMLElement.prototype.showPopover = jest.fn()
  HTMLElement.prototype.hidePopover = jest.fn()
  HTMLElement.prototype.togglePopover = jest.fn()
}

const plugins = {
  '@development-framework/dm-core-plugins/table': { component: TablePlugin },
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

const editConfig = {
  columns: [{ data: 'name', label: 'Name' }],
  variant: [{ name: 'edit' }],
}

describe('TablePlugin + SaveCoordinator', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows its own Save/Undo buttons when there is no ancestor anchor (standalone)', async () => {
    mockContainedList([{ name: 'Alpha' }])

    const { findByText } = render(
      withApplication(
        <TablePlugin idReference='ds/$1.items' type='Root' config={editConfig} />
      )
    )

    expect(await findByText('Save')).toBeTruthy()
  })

  it('hides its own Save/Undo buttons when an ancestor anchor owns saving', async () => {
    mockContainedList([{ name: 'Alpha' }])
    const store = createSaveCoordinatorStore()

    const { queryByText, container } = render(
      withApplication(
        <SaveCoordinatorProvider value={store}>
          <SaveAnchorBoundary>
            <TablePlugin
              idReference='ds/$1.items'
              type='Root'
              config={editConfig}
            />
          </SaveAnchorBoundary>
        </SaveCoordinatorProvider>
      )
    )

    // Wait for the table to finish loading before asserting absence - the cell
    // value lives in an input's value attribute, not as plain text content.
    await waitFor(() =>
      expect(container.querySelector('input[value="Alpha"]')).toBeTruthy()
    )
    expect(queryByText('Save')).toBeNull()
  })

  it('still flushes an edit via the coordinator even though its own Save is hidden', async () => {
    const updateMock = mockContainedList([{ name: 'Alpha' }])
    const store = createSaveCoordinatorStore()

    const { container } = render(
      withApplication(
        <SaveCoordinatorProvider value={store}>
          <SaveAnchorBoundary>
            <TablePlugin
              idReference='ds/$1.items'
              type='Root'
              config={editConfig}
            />
          </SaveAnchorBoundary>
        </SaveCoordinatorProvider>
      )
    )

    const input = await waitFor(() => {
      const el = container.querySelector('input[value="Alpha"]') as HTMLInputElement
      expect(el).toBeTruthy()
      return el
    })
    fireEvent.change(input, { target: { value: 'Beta' } })
    fireEvent.blur(input)

    await waitFor(() => expect(store.getSnapshot()).toBe(true))

    // A read-only sibling (e.g. a Graph) watching the same address, to confirm
    // saving via the coordinator's saveAll() - not just the table's own hidden
    // Save button - still triggers refetch on related plugins.
    const siblingRefetch = jest.fn()
    store.register({
      id: 'graph:ds/$1.items',
      idReference: 'ds/$1.items',
      refetch: siblingRefetch,
    })

    await act(() => store.saveAll())

    expect(updateMock).toHaveBeenCalled()
    expect(siblingRefetch).toHaveBeenCalledTimes(1)
  })
})
