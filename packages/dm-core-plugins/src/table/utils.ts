import { TTableConfig } from '@development-framework/dm-core'

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
