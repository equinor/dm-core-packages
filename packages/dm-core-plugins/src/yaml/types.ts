import type { IUIPlugin } from '@development-framework/dm-core'

export type TLanguages = 'json' | 'yaml'

export type TYamlPluginConfig = {
  languages: TLanguages[]
  editable: boolean
}

export type YamlPluginProps = {
  config: TYamlPluginConfig
} & IUIPlugin

export const defaultConfig: TYamlPluginConfig = {
  languages: ['yaml', 'json'],
  editable: true,
}
