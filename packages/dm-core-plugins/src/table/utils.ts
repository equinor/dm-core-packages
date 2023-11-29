import {
  TGenericObject,
  TTableConfig,
  TTableRowItem,
} from '@development-framework/dm-core'

export function createItemsFromDocument(
  document: TGenericObject | null
): TTableRowItem[] {
  return document
    ? Object.values(document)?.map((data, index) => {
        const id: string = crypto.randomUUID()
        return {
          data,
          index,
          key: id,
          id,
        }
      })
    : []
}

const defaultConfig: TTableConfig = {
  columns: [{ data: 'name', label: 'Name' }, { data: 'type' }],
  variant: [
    {
      name: 'view',
      density: 'compact',
      functionality: { add: true, delete: true },
    },
  ],
}

export function mergeConfigs(config: TTableConfig): TTableConfig {
  return {
    ...defaultConfig,
    ...config,
    variant: config.variant.map((variant) => ({
      ...variant,
      functionality: {
        delete: variant.functionality?.delete !== false ? true : false,
        add: variant.functionality?.add !== false ? true : false,
      },
    })),
  }
}
