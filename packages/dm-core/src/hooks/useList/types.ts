import { ErrorResponse } from '../../services'
import { TAttribute, TLinkReference } from '../../types'

export type TItem<T> = {
  key: string
  index: number
  data: T | null
  reference?: TLinkReference | null
  isSaved?: boolean
}

export interface IUseListReturnType<T> {
  items: TItem<T>[]
  setItems: React.Dispatch<React.SetStateAction<TItem<T>[]>>
  attribute: TAttribute | null
  isLoading: boolean
  addItem: (saveOnAdd?: boolean, insertAtIndex?: number) => Promise<void>
  updateItem: (
    itemToUpdate: TItem<T>,
    newDocument: T,
    saveOnUpdate?: boolean
  ) => Promise<void>
  removeItem: (itemToDelete: TItem<T>, saveOnRemove?: boolean) => Promise<void>
  error: ErrorResponse | null
  addReference: (
    address: string,
    entity: T | null,
    saveOnAdd?: boolean
  ) => Promise<string>
  save: (itemsToSave: TItem<T>[]) => Promise<void>
  updateAttribute: (
    itemToUpdate: TItem<T>,
    attribute: string,
    newValue: any,
    saveOnUpdate?: boolean
  ) => void
  dirtyState: boolean
  setDirtyState: React.Dispatch<React.SetStateAction<boolean>>
  moveItem: (itemToMove: TItem<T>, direction: 'up' | 'down') => void
  reloadData: any
}
