import { EBlueprint, TMeta, TValidEntity } from '@development-framework/dm-core'

export function setMetaInDocument(
  document: TValidEntity,
  user: string
): TValidEntity {
  const meta: TMeta = document._meta_ || {
    type: EBlueprint.META,
    version: '0.0.1',
    dependencies: [],
    createdBy: user,
    createdTimestamp: new Date().toISOString(),
  }
  document._meta_ = {
    ...meta,
    lastModifiedBy: user,
    lastModifiedTimestamp: new Date().toISOString(),
  }
  return document
}
