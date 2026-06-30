import {
  NativeSelect,
  Switch,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import type { TGridArea, TGridItem, TGridSize } from '../../grid/types'
import { getWidgetConfigValue } from '../model'
import * as Styled from '../styles'
import type { TBlock, TInspectorField } from '../types'
import { ImageUploadField } from './ImageUploadField'
import { TableSourceField } from './TableSourceField'

export type TInspectorHandlers = {
  onTitle: (value: string) => void
  onLabel: (value: string) => void
  onScope: (value: string) => void
  onArea: (area: TGridArea) => void
  onConfigValue: (key: string, value: unknown) => void
  onStyleValue: (
    key: keyof NonNullable<TGridItem['style']>,
    value: unknown,
    target: 'body' | 'title'
  ) => void
  /** End the current coalescing run (called on blur) so each edit is one undo. */
  onCommit: () => void
}

type TInspectorProps = TInspectorHandlers & {
  item: TGridItem | null
  block: TBlock | undefined
  gridSize: TGridSize
  dataSource: string
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
  dataSource,
  onChange,
}: {
  field: TInspectorField
  value: unknown
  dataSource: string
  onChange: (value: unknown) => void
}) => {
  const id = `inspector-${field.target.kind}-${
    field.target.kind === 'config' ? field.target.key : field.label
  }`

  if (field.type === 'image-upload') {
    return (
      <ImageUploadField
        label={field.label}
        value={value === undefined || value === null ? '' : String(value)}
        dataSource={dataSource}
        onChange={(address) => onChange(address)}
      />
    )
  }

  if (field.type === 'table-source') {
    return (
      <TableSourceField
        label={field.label}
        value={Array.isArray(value) ? (value as string[][]) : []}
        onChange={(rows) => onChange(rows)}
      />
    )
  }

  if (field.type === 'boolean') {
    return (
      <Switch
        label={field.label}
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
      />
    )
  }

  if (field.type === 'select') {
    const options = field.options ?? []
    const isNumeric = options.some((option) => typeof option.value === 'number')
    return (
      <NativeSelect
        id={id}
        label={field.label}
        value={value === undefined || value === null ? '' : String(value)}
        onChange={(event) =>
          onChange(isNumeric ? Number(event.target.value) : event.target.value)
        }
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
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
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        if (field.type !== 'number') {
          onChange(event.target.value)
          return
        }
        if (event.target.value === '') {
          onChange(undefined)
          return
        }
        const parsed = Number(event.target.value)
        // Ignore intermediate/invalid numeric input (e.g. "-", "1e") so NaN
        // never enters the model.
        if (Number.isFinite(parsed)) onChange(parsed)
      }}
    />
  )
}

const StyleGroup = ({
  title,
  style,
  onChange,
}: {
  title: string
  style: TGridItem['style']
  onChange: (key: keyof NonNullable<TGridItem['style']>, value: unknown) => void
}) => (
  <Styled.InspectorSection>
    <Styled.InspectorSectionTitle>{title}</Styled.InspectorSectionTitle>
    <Styled.InspectorField>
      <NativeSelect
        id={`${title}-textAlign`}
        label='Horizontal align'
        value={style?.textAlign ?? ''}
        onChange={(event) =>
          onChange('textAlign', event.target.value || undefined)
        }
      >
        <option value=''>Default</option>
        <option value='left'>Left</option>
        <option value='center'>Center</option>
        <option value='right'>Right</option>
      </NativeSelect>
    </Styled.InspectorField>
    <Styled.InspectorField>
      <NativeSelect
        id={`${title}-verticalAlign`}
        label='Vertical align'
        value={style?.verticalAlign ?? ''}
        onChange={(event) =>
          onChange('verticalAlign', event.target.value || undefined)
        }
      >
        <option value=''>Default</option>
        <option value='top'>Top</option>
        <option value='center'>Center</option>
        <option value='bottom'>Bottom</option>
      </NativeSelect>
    </Styled.InspectorField>
    <Styled.InspectorField>
      <NativeSelect
        id={`${title}-fontSize`}
        label='Text size'
        value={style?.fontSize ?? ''}
        onChange={(event) =>
          onChange('fontSize', event.target.value || undefined)
        }
      >
        <option value=''>Default</option>
        <option value='12px'>Small (12px)</option>
        <option value='16px'>Normal (16px)</option>
        <option value='20px'>Large (20px)</option>
        <option value='28px'>X-Large (28px)</option>
        <option value='40px'>Heading (40px)</option>
      </NativeSelect>
    </Styled.InspectorField>
    <Styled.InspectorField>
      <Switch
        label='Bold'
        checked={Boolean(style?.bold)}
        onChange={(event) => onChange('bold', event.target.checked)}
      />
    </Styled.InspectorField>
    <Styled.InspectorField>
      <TextField
        id={`${title}-color`}
        label='Text color'
        placeholder='#333 or red'
        value={style?.color ?? ''}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange('color', event.target.value || undefined)
        }
      />
    </Styled.InspectorField>
    <Styled.InspectorField>
      <NativeSelect
        id={`${title}-padding`}
        label='Padding'
        value={style?.padding ?? ''}
        onChange={(event) =>
          onChange('padding', event.target.value || undefined)
        }
      >
        <option value=''>None</option>
        <option value='8px'>Small (8px)</option>
        <option value='16px'>Medium (16px)</option>
        <option value='32px'>Large (32px)</option>
      </NativeSelect>
    </Styled.InspectorField>
  </Styled.InspectorSection>
)

export const Inspector = ({
  item,
  block,
  gridSize,
  dataSource,
  onTitle,
  onLabel,
  onScope,
  onArea,
  onConfigValue,
  onStyleValue,
  onCommit,
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
    // Committing on blur ends the per-field coalescing run, so each field edit
    // becomes a single undo step.
    <Styled.InspectorPanel onBlur={onCommit}>
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

      <StyleGroup
        title='Title style'
        style={item.titleStyle}
        onChange={(key, value) => onStyleValue(key, value, 'title')}
      />

      <StyleGroup
        title='Body style'
        style={item.style}
        onChange={(key, value) => onStyleValue(key, value, 'body')}
      />

      {block?.fields && block.fields.length > 0 && (
        <Styled.InspectorSection>
          <Styled.InspectorSectionTitle>Settings</Styled.InspectorSectionTitle>
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
                  dataSource={dataSource}
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
