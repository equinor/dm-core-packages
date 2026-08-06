import type { IUIPlugin } from '@development-framework/dm-core'

export type TCounterPluginConfig = {
  attribute: string
  incrementValue: number
  decrementValue: number
  label: string
  initialValue: number
}

export type CounterPluginProps = {
  config: TCounterPluginConfig
} & IUIPlugin

export const defaultConfig: TCounterPluginConfig = {
  attribute: 'count',
  incrementValue: 1,
  decrementValue: 1,
  label: 'Counter',
  initialValue: 0,
}