import { type IUIPlugin, ViewCreator } from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'
import * as Styled from './styles'
import { type TCol, type TGridPluginConfig, defaultConfig } from './types'

export const ResponsiveGridPlugin = (
  props: IUIPlugin & { config: TGridPluginConfig }
): React.ReactElement => {
  const { config, idReference, onSubmit, onChange } = props

  const internalConfig: TGridPluginConfig = {
    ...defaultConfig,
    ...config,
  }

  return (
    <Styled.Grid
      className='dm-plugin-padding dm-parent-plugin'
      spacing={internalConfig.spacing}
    >
      {internalConfig.views.map((col: TCol, index: number) => {
        return (
          <Styled.GridItem key={index} size={col.size}>
            {col?.title && <Typography variant='h4'>{col.title}</Typography>}
            <ViewCreator
              idReference={idReference}
              viewConfig={col.viewConfig}
              onSubmit={onSubmit}
              onChange={onChange}
            />
          </Styled.GridItem>
        )
      })}
    </Styled.Grid>
  )
}
