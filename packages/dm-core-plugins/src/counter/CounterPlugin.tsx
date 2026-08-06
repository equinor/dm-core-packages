import {
  Loading,
  type TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import { Stack } from '../common'
import { type CounterPluginProps, defaultConfig } from './types'

/**
 * Component which renders a numeric attribute with increment/decrement buttons.
 *
 * @docs Plugins
 * @scope CounterPlugin
 *
 * @param {TCounterPluginConfig} props {@link TCounterPluginConfig}
 */
export const CounterPlugin = (props: CounterPluginProps) => {
  const { idReference, config: userConfig } = props
  const config = { ...defaultConfig, ...userConfig }
  const { document, isLoading, error, updateDocument } =
    useDocument<TGenericObject>(idReference, 1)

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading || !document) return <Loading />

 const value: number = Number(document[config.attribute] ?? config.initialValue)

const setValue = (next: number) =>
  updateDocument({ ...document, [config.attribute]: next }, false, true)
  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={1}
      className='dm-plugin-padding'
    >
      <Typography variant='h5'>{config.label}</Typography>
      <Button
        variant='outlined'
        onClick={() => setValue(value - config.decrementValue)}
      >
        -
      </Button>
      <Typography data-testid='counter-value'>{value}</Typography>
      <Button
        variant='outlined'
        onClick={() => setValue(value + config.incrementValue)}
      >
        +
      </Button>
    </Stack>
  )
}