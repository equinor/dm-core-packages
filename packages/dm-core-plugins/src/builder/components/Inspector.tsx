import { Switch, TextField, Typography } from '@equinor/eds-core-react'
import type { TGridArea, TGridItem, TGridSize } from '../../grid/types'
import { getWidgetConfigValue } from '../model'
import * as Styled from '../styles'
import type { TBlock, TInspectorField } from '../types'

export type TInspectorHandlers = {
  onTitle: (value: string) => void
  onLabel: (value: string) => void
  onScope: (value: string) => void
  onArea: (area: TGridArea) => void
  onConfigValue: (key: string, value: unknown) => void
}

type TInspectorProps = TInspectorHandlers & {
  item: TGridItem | null
  block: TBlock | undefined
  gridSize: TGridSize
}

const areaToBox = (area: TGridArea) => ({
  x: area.columnStart,
  y: area.rowStart,
  width: area.columnEnd - area.columnStart + 1,
  height: area.rowEnd - area.rowStart + 1,
})

const boxToArea = (box: {
  x: number
  y: number
  width: number
  height: number
}): TGridArea => ({
  columnStart: box.x,
  columnEnd: box.x + Math.max(1, box.width) - 1,
  rowStart: box.y,
  rowEnd: box.y + Math.max(1, box.height) - 1,
})

const toNumber = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const FieldControl = ({
  field,
  value,
  onChange,
}: {
  field: TInspectorField
  value: unknown
  onChange: (value: unknown) => void
}) => {
  const id = `inspector-${field.target.kind}-${
    field.target.kind === 'config' ? field.target.key : field.label
  }`

  if (field.type === 'boolean') {
    return (
      <Switch
        label={field.label}
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <>
        <Styled.FieldLabel htmlFor={id}>{field.label}</Styled.FieldLabel>
        <Styled.Textarea
          id={id}
          value={value === undefined || value === null ? '' : String(value)}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </>
    )
  }

  return (
    <TextField
      id={id}
      label={field.label}
      type={field.type === 'number' ? 'number' : 'text'}
      placeholder={field.placeholder}
      value={value === undefined || value === null ? '' : String(value)}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        onChange(
          field.type === 'number'
            ? event.target.value === ''
              ? undefined
              : Number(event.target.value)
            : event.target.value
        )
      }
    />
  )
}

export const Inspector = ({
  item,
  block,
  gridSize,
  onTitle,
  onLabel,
  onScope,
  onArea,
  onConfigValue,
}: TInspectorProps): React.ReactElement => {
  if (!item) {
    return (
      <Styled.InspectorPanel>
        <Typography variant='h6'>Properties</Typography>
        <Styled.InspectorEmpty>
          Select a widget on the canvas to edit its properties.
        </Styled.InspectorEmpty>
      </Styled.InspectorPanel>
    )
  }

  const box = areaToBox(item.gridArea)
  const updateBox = (patch: Partial<typeof box>) =>
    onArea(boxToArea({ ...box, ...patch }))

  return (
    <Styled.InspectorPanel>
      <Typography variant='h6'>
        {block?.label ?? 'Widget'} properties
      </Typography>

      <Styled.InspectorSection>
        <Styled.InspectorSectionTitle>General</Styled.InspectorSectionTitle>
        <Styled.InspectorField>
          <TextField
            id='inspector-title'
            label='Title'
            value={item.title ?? ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onTitle(event.target.value)
            }
          />
        </Styled.InspectorField>
        <Styled.InspectorField>
          <TextField
            id='inspector-label'
            label='Label'
            value={item.viewConfig.label ?? ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onLabel(event.target.value)
            }
          />
        </Styled.InspectorField>
      </Styled.InspectorSection>

      <Styled.InspectorSection>
        <Styled.InspectorSectionTitle>Layout</Styled.InspectorSectionTitle>
        <Styled.LayoutGrid>
          <TextField
            id='inspector-x'
            label='Column'
            type='number'
            value={String(box.x)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateBox({ x: Math.max(1, toNumber(event.target.value, box.x)) })
            }
          />
          <TextField
            id='inspector-y'
            label='Row'
            type='number'
            value={String(box.y)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateBox({ y: Math.max(1, toNumber(event.target.value, box.y)) })
            }
          />
          <TextField
            id='inspector-w'
            label='Width'
            type='number'
            value={String(box.width)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateBox({
                width: Math.max(1, toNumber(event.target.value, box.width)),
              })
            }
          />
          <TextField
            id='inspector-h'
            label='Height'
            type='number'
            value={String(box.height)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateBox({
                height: Math.max(1, toNumber(event.target.value, box.height)),
              })
            }
          />
        </Styled.LayoutGrid>
        <Styled.FieldHelp>
          Grid is {gridSize.columns} columns × {gridSize.rows} rows.
        </Styled.FieldHelp>
      </Styled.InspectorSection>

      {block?.contentModel === 'data' && (
        <Styled.InspectorSection>
          <Styled.InspectorSectionTitle>
            Data binding
          </Styled.InspectorSectionTitle>
          <Styled.InspectorField>
            <TextField
              id='inspector-scope'
              label='Scope'
              placeholder='e.g. orders or order.product'
              value={item.viewConfig.scope ?? ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onScope(event.target.value)
              }
            />
            <Styled.FieldHelp>
              Attribute path this widget binds to on the document.
            </Styled.FieldHelp>
          </Styled.InspectorField>
        </Styled.InspectorSection>
      )}

      {block?.fields && block.fields.length > 0 && (
        <Styled.InspectorSection>
          <Styled.InspectorSectionTitle>Content</Styled.InspectorSectionTitle>
          {block.fields.map((field) => {
            const value =
              field.target.kind === 'scope'
                ? item.viewConfig.scope
                : field.target.kind === 'label'
                  ? item.viewConfig.label
                  : getWidgetConfigValue(item, field.target.key)
            return (
              <Styled.InspectorField
                key={`${field.target.kind}-${field.label}`}
              >
                <FieldControl
                  field={field}
                  value={value}
                  onChange={(next) => {
                    if (field.target.kind === 'scope')
                      onScope(String(next ?? ''))
                    else if (field.target.kind === 'label')
                      onLabel(String(next ?? ''))
                    else onConfigValue(field.target.key, next)
                  }}
                />
                {field.help && (
                  <Styled.FieldHelp>{field.help}</Styled.FieldHelp>
                )}
              </Styled.InspectorField>
            )
          })}
        </Styled.InspectorSection>
      )}
    </Styled.InspectorPanel>
  )
}
