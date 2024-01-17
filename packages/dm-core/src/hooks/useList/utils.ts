import { AxiosResponse } from 'axios'
import { DmssAPI } from '../../services'
import { TGenericObject, TLinkReference } from '../../types'
import { TItem } from './types'

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const arrayCopy = [...arr]
  const element = arrayCopy[fromIndex]
  arrayCopy.splice(fromIndex, 1)
  arrayCopy.splice(toIndex, 0, element)
  return arrayCopy
}

export function createNewItemObject(
  data: any,
  newItemIndex: number,
  isSaved: boolean
) {
  const id: string = crypto.randomUUID()
  return {
    key: id,
    data,
    index: newItemIndex,
    reference: null,
    isSaved,
  }
}

export function createItemsFromDocument(
  response: AxiosResponse,
  contained: boolean | undefined,
  resolvedReferences: any[]
): TItem<any>[] {
  if (contained && !Array.isArray(response.data)) {
    throw new Error(
      `Not an array! Got document ${JSON.stringify(response.data)} `
    )
  }
  const items = Object.values(response.data).map((data, index) => ({
    key: crypto.randomUUID() as string,
    index: index,
    data: contained ? data : resolvedReferences || data,
    reference: contained ? null : (data as TLinkReference),
    isSaved: true,
  }))
  return items
}

function getParentId(idReference: string): string {
  const lastDotIndex = idReference.lastIndexOf('.')
  return idReference.substring(0, lastDotIndex)
}

// TODO: This is now very basic. It's expected that "template" is a direct attribute on the parent. No path/id-traversal is allowed.
export async function getTemplate(
  dmssAPI: DmssAPI,
  idReference: string,
  template: string
): Promise<TGenericObject> {
  const parentId = getParentId(idReference)

  // This is a temporary thing to allow for "correct syntax" in recipes, without actually parsing it...
  // The plan is to swap the meaning of "^" and "~(parent)", and allow for more complex traversing
  if (template.substring(0, 2) === '~.') {
    template = template.substring(2)
  }
  const templateEntity: AxiosResponse = await dmssAPI.documentGet({
    address: `${parentId}.${template}`,
    depth: 2,
  })
  return templateEntity.data as TGenericObject
}
