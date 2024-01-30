import { IUIPlugin, Stack, ViewCreator } from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'
import React from 'react'
import { Col, Container, Row } from 'react-grid-system'
import { TCol, TGridPluginConfig, TRow } from './types'

const defaultConfig: TGridPluginConfig = {
  rows: [],
}

export const ResponsiveGridPlugin = (
  props: IUIPlugin & { config: TGridPluginConfig }
): React.ReactElement => {
  const { config, idReference, type, onSubmit, onChange } = props

  const internalConfig: TGridPluginConfig = {
    ...defaultConfig,
    ...config,
  }

  return (
    <Stack
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        maxWidth: 'max-content',
      }}
    >
      <Container>
        {internalConfig.rows.map((row: TRow) => {
          const columns = row.columns.map((col: TCol) => {
            return (
              <Col {...col.size}>
                <div style={{ marginBottom: '20px' }}>
                  {col?.title && (
                    <Typography variant='h4'>{col.title}</Typography>
                  )}
                  <ViewCreator
                    idReference={idReference}
                    viewConfig={col.viewConfig}
                    onSubmit={onSubmit}
                    onChange={onChange}
                  />
                </div>
              </Col>
            )
          })
          return <Row gutterWidth={row.gutterWidth || 30}>{columns}</Row>
        })}
      </Container>
    </Stack>
  )
}
