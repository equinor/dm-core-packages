import { get } from 'lodash'

export function getKey<T>(
  object: { [k: string]: any } | undefined,
  key: string,
  type: string
): T | undefined {
  return object !== undefined && key in object && typeof object[key] === type
    ? object[key]
    : undefined
}

export function rescopeUsingIdReference(entity: any, idReference: string) {
  const scope = idReference.split('.').slice(1).join('.')
  const scopedEntity = get(entity, scope)
  return scopedEntity
}
