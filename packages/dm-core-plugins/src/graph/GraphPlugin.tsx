import {
  Loading,
  type TGenericObject,
  useList,
  usePluginSaveRegistration,
} from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'
import { defaultConfig, type TGraphPluginProps } from './types'

const CHART_HEIGHT_PX = 200

export const GraphPlugin = (props: TGraphPluginProps) => {
  const { idReference, config: userConfig } = props
  const config = { ...defaultConfig, ...userConfig }
  const { items, isLoading, error, reloadData } =
    useList<TGenericObject>(idReference)

  usePluginSaveRegistration({
    id: `graph:${idReference}`,
    idReference,
    refetch: () => reloadData({}),
  })

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading) return <Loading />

  const values = items.map((item) =>
    Number(item.data?.[config.valueAttribute] ?? 0)
  )
  const maxValue = Math.max(1, ...values)

  return (
    <div className='dm-plugin-padding'>
      {config.title && <Typography variant='h5'>{config.title}</Typography>}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.5rem',
          height: CHART_HEIGHT_PX,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant='caption'>{values[index]}</Typography>
            <div
              data-testid='graph-bar'
              style={{
                width: '2rem',
                height: `${(values[index] / maxValue) * (CHART_HEIGHT_PX - 40)}px`,
                background: config.color,
                borderRadius: '2px 2px 0 0',
              }}
            />
            <Typography variant='caption'>
              {String(item.data?.[config.labelAttribute] ?? '')}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
