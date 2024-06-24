import { IUIPlugin, ViewCreator } from '@development-framework/dm-core'
import { DirectionTypes, Stack, StackProps } from '../common'
import { StackPluginConfig, defaultConfig } from './types'

export const StackPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const config: StackPluginConfig = { ...defaultConfig, ...props.config }

  // map plugin language to stack props/css language
  const configMap: { [name: string]: string } = {
    vertical: 'column',
    horizontal: 'row',
    horizontalPlacement:
      config.direction === 'horizontal' ? 'alignItems' : 'justifyContent',
    verticalPlacement:
      config.direction === 'horizontal' ? 'justifyContent' : 'alignItems',
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    top: 'flex-start',
    bottom: 'flex-end',
    spaceEvenly: 'space-between',
  }

  const stackProps: StackProps = {
    direction: configMap[config.direction] as DirectionTypes,
    [configMap.verticalPlacement]: configMap[config.verticalPlacement],
    [configMap.horizontalPlacement]: configMap[config.horizontalPlacement],
    className: config.classNames.join(' '),
    spacing: config.spacing,
    wrap: config.wrap ? 'wrap' : 'no-wrap',
    style: { maxWidth: config.maxWidth },
  }

  return (
    <Stack
      {...stackProps}
      className={`dm-plugin-padding dm-parent-plugin ${config.classNames}`}
    >
      {config.items?.map((item, index) => (
        <ViewCreator
          key={`${item.recipe}_${index}`}
          idReference={idReference}
          viewConfig={item}
          onSubmit={props.onSubmit}
          onChange={props.onChange}
        />
      ))}
    </Stack>
  )
}
