import {
  BlueprintPicker,
  EPrimitiveTypes,
  INPUT_FIELD_WIDTH,
  Select,
  type TGenericObject,
  truncatePathString,
} from '@development-framework/dm-core'
import { Input, Label, Radio, Switch, TextField } from '@equinor/eds-core-react'
import type { ChangeEvent } from 'react'
import { Stack } from '../common'

type TAttribute = {
  type: string
  name: string
  attributeType: EAttributeTypes | string
  dimensions: string
  label: string
  default?: string | number | boolean | TGenericObject
  optional: boolean
  contained: boolean
}

enum EAttributeTypes {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
}

export const BlueprintAttribute = (props: {
  attribute: TAttribute
  setAttribute: (attr: TAttribute) => void
}) => {
  const { attribute, setAttribute } = props
  return (
    <Stack spacing={0.5}>
      <TextField
        id='name'
        label={'Name'}
        value={attribute?.name || ''}
        placeholder='Name of the attribute'
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, name: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <TextField
        id='label'
        label={'Label'}
        value={attribute?.label || ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, label: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Stack>
        <Label label={'Type'} htmlFor={`${attribute.name}-type`} />
        <Stack direction='row' alignItems='center' spacing={0.5}>
          <Select
            id={`${attribute.name}-type`}
            value={truncatePathString(attribute.attributeType)}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const newType = e.target.value
              setAttribute({
                ...attribute,
                attributeType: newType,
                default: newType === 'boolean' ? true : undefined,
              })
            }}
          >
            {Object.keys(EAttributeTypes).map((key) => {
              // Avoid duplication, as we are explicitly adding the formData value as well
              if (key === attribute.attributeType) return null
              return <option key={key}>{key}</option>
            })}
            <option key={attribute.attributeType}>
              {truncatePathString(attribute.attributeType)}
            </option>
          </Select>
          {!['string', 'number', 'boolean'].includes(
            attribute.attributeType
          ) && (
            <BlueprintPicker
              label='Select blueprint'
              onChange={(selectedBlueprint: string) =>
                setAttribute({
                  ...attribute,
                  attributeType: selectedBlueprint,
                })
              }
            />
          )}
        </Stack>
      </Stack>
      <Stack>
        <Label htmlFor='default' label='Default value' />
        {attribute.attributeType === 'boolean' ? (
          <Stack role='radiogroup' direction='row' spacing={1}>
            {[true, false].map((option) => (
              <Radio
                key={String(option)}
                checked={attribute?.default === option}
                label={String(option)}
                onChange={(e: any) =>
                  setAttribute({ ...attribute, default: option })
                }
              />
            ))}
          </Stack>
        ) : (
          <Input
            type={attribute.attributeType === 'number' ? 'number' : 'text'}
            id='default'
            value={attribute?.default || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              let value: string | number = event.target.value
              if (attribute.attributeType === 'number') value = Number(value)
              setAttribute({ ...attribute, default: value })
            }}
            style={{ width: INPUT_FIELD_WIDTH }}
          />
        )}
      </Stack>
      <TextField
        id='dimensions'
        label={'Dimensions'}
        value={attribute?.dimensions || ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, dimensions: event.target.value })
        }
        placeholder='Example: "*,2,99"'
        style={{ width: '140px' }}
      />
      {!Object.values(EPrimitiveTypes).includes(attribute.attributeType) && (
        <Switch
          label='Contained'
          defaultChecked={attribute?.contained ?? true}
          onChange={(e: any) =>
            setAttribute({ ...attribute, contained: e.target.checked })
          }
        />
      )}
      <Switch
        label='Optional'
        defaultChecked={attribute?.optional ?? false}
        onChange={(e: any) =>
          setAttribute({ ...attribute, optional: e.target.checked })
        }
      />
    </Stack>
  )
}
