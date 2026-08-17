import {
  DMApplicationProvider,
  createSaveCoordinatorStore,
  DmssAPI,
  SaveAnchorBoundary,
  SaveCoordinatorProvider,
  type TUiPluginMap,
} from '@development-framework/dm-core'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import {
  mockBlueprintGet,
  mockDocumentGet,
  mockUpdateDocument,
} from './test-utils'
import { FormPlugin } from './FormPlugin'

const plugins = {
  '@development-framework/dm-core-plugins/form': { component: FormPlugin },
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

const mockRootBlueprint = () =>
  mockBlueprintGet([
    {
      type: 'system/SIMOS/Blueprint',
      name: 'Root',
      attributes: [
        { name: 'foo', type: 'system/SIMOS/BlueprintAttribute', attributeType: 'string' },
      ],
    },
  ])

describe('FormPlugin + SaveCoordinator', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows its own submit button when there is no ancestor SaveCoordinator (standalone)', async () => {
    mockRootBlueprint()
    mockDocumentGet({ 'ds/$1': { type: 'Root', foo: 'bar' } })

    const { getByTestId } = render(
      withApplication(<FormPlugin idReference='ds/$1' type='Root' />)
    )

    await waitFor(() => {
      expect(getByTestId('form-submit')).toBeTruthy()
    })
  })

  it('hides its own submit button when an ancestor anchor already owns saving', async () => {
    mockRootBlueprint()
    mockDocumentGet({ 'ds/$1': { type: 'Root', foo: 'bar' } })
    const store = createSaveCoordinatorStore()

    const { queryByTestId, container } = render(
      withApplication(
        <SaveCoordinatorProvider value={store}>
          <SaveAnchorBoundary>
            <FormPlugin idReference='ds/$1' type='Root' />
          </SaveAnchorBoundary>
        </SaveCoordinatorProvider>
      )
    )

    await waitFor(() => {
      expect(container.querySelector('input#foo')).toBeTruthy()
    })
    expect(queryByTestId('form-submit')).toBeNull()
  })

  it('still saves via the coordinator even though its own button is hidden', async () => {
    mockRootBlueprint()
    mockDocumentGet({ 'ds/$1': { type: 'Root', foo: 'bar' } })
    const updateMock = mockUpdateDocument({ type: 'Root', foo: 'baz' })
    const store = createSaveCoordinatorStore()

    const { container } = render(
      withApplication(
        <SaveCoordinatorProvider value={store}>
          <SaveAnchorBoundary>
            <FormPlugin idReference='ds/$1' type='Root' />
          </SaveAnchorBoundary>
        </SaveCoordinatorProvider>
      )
    )

    const input = await waitFor(() => {
      const el = container.querySelector('input#foo') as HTMLInputElement
      expect(el).toBeTruthy()
      return el
    })
    fireEvent.change(input, { target: { value: 'baz' } })

    await waitFor(() => expect(store.getSnapshot()).toBe(true))

    await act(() => store.saveAll())

    expect(updateMock).toHaveBeenCalled()
  })

  it("saveAll() doesn't resolve until the form's own save has actually finished", async () => {
    mockRootBlueprint()
    mockDocumentGet({ 'ds/$2': { type: 'Root', foo: 'bar' } })
    const store = createSaveCoordinatorStore()

    // A deferred documentUpdate response - lets us assert on ordering instead of
    // just "was it called eventually".
    let resolveUpdate!: () => void
    const updateMock = jest.spyOn(DmssAPI.prototype, 'documentUpdate')
    // @ts-ignore
    updateMock.mockImplementation(
      () =>
        new Promise<any>((resolve) => {
          resolveUpdate = () =>
            resolve({ data: { data: { type: 'Root', foo: 'baz' } } })
        })
    )

    const { container } = render(
      withApplication(
        <SaveCoordinatorProvider value={store}>
          <SaveAnchorBoundary>
            <FormPlugin idReference='ds/$2' type='Root' />
          </SaveAnchorBoundary>
        </SaveCoordinatorProvider>
      )
    )

    const input = await waitFor(() => {
      const el = container.querySelector('input#foo') as HTMLInputElement
      expect(el).toBeTruthy()
      return el
    })
    fireEvent.change(input, { target: { value: 'baz' } })

    await waitFor(() => expect(store.getSnapshot()).toBe(true))

    let saveAllResolved = false
    let saveAllPromise!: Promise<void>
    await act(async () => {
      saveAllPromise = store.saveAll().then(() => {
        saveAllResolved = true
      })
      // documentUpdate() is still pending (deliberately un-resolved) at this
      // point - saveAll() must not have resolved yet either.
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(updateMock).toHaveBeenCalled()
    expect(saveAllResolved).toBe(false)

    await act(async () => {
      resolveUpdate()
      await saveAllPromise
    })

    expect(saveAllResolved).toBe(true)
  })
})
