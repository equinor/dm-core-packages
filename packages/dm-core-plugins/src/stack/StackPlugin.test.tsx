import {
  createSaveCoordinatorStore,
  SaveCoordinatorProvider,
} from '@development-framework/dm-core'
import { render } from '@testing-library/react'
import React from 'react'
import { StackPlugin } from './StackPlugin'

describe('StackPlugin + SaveCoordinator', () => {
  it('claims the save anchor and shows a shared button when something inside is savable', () => {
    const store = createSaveCoordinatorStore()
    store.register({
      id: 'entry',
      idReference: 'ds/$1',
      isDirty: true,
      save: async () => {},
    })

    const { getByRole } = render(
      <SaveCoordinatorProvider value={store}>
        <StackPlugin idReference='ds/$1' type='Root' config={{ items: [] }} />
      </SaveCoordinatorProvider>
    )

    expect(getByRole('button', { name: 'Save all changes' })).toBeTruthy()
  })

  it('shows no button at all when nothing inside is savable (e.g. a Stack of read-only plugins)', () => {
    const store = createSaveCoordinatorStore()
    store.register({ id: 'entry', idReference: 'ds/$1' }) // no save fn

    const { queryByRole } = render(
      <SaveCoordinatorProvider value={store}>
        <StackPlugin idReference='ds/$1' type='Root' config={{ items: [] }} />
      </SaveCoordinatorProvider>
    )

    expect(queryByRole('button', { name: 'Save all changes' })).toBeNull()
  })
})

