import { Input, Label, Switch, TextField } from '@equinor/eds-core-react'
import { ChangeEvent } from 'react'
import {
  BlueprintPicker,
  EPrimitiveTypes,
  INPUT_FIELD_WIDTH,
  Select,
  TGenericObject,
  truncatePathString,
} from '@development-framework/dm-core'
import * as React from 'react'
import { Spacer } from './BlueprintPlugin'

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
  console.log(attribute)
  return (
    <div>
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
      <Spacer />
      <TextField
        id='label'
        label={'Label'}
        value={attribute?.label || ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, label: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <div style={{ display: 'flex', alignItems: 'self-end' }}>
        <div style={{ display: 'block' }}>
          <Label label={'Type'} />
          <Select
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
              {attribute.attributeType}
            </option>
          </Select>
        </div>
        {!['string', 'number', 'boolean'].includes(attribute.attributeType) && (
          <div style={{ marginLeft: '10px' }}>
            <BlueprintPicker
              label={'Select'}
              onChange={(selectedBlueprint: string) =>
                setAttribute({
                  ...attribute,
                  attributeType: selectedBlueprint,
                })
              }
              fieldType={'button'}
            />
          </div>
        )}
      </div>
      <Spacer />
      <Label htmlFor='default' label='Default value' />
      {attribute.attributeType === 'boolean' ? (
        <>
          <Switch
            defaultChecked={!!attribute?.default ?? false}
            onChange={(e: any) =>
              setAttribute({ ...attribute, default: e.target.checked })
            }
          />
          {attribute.default ? String(attribute.default) : 'false'}
        </>
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
      <Spacer />
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          id='dimensions'
          label={'Dimensions'}
          value={attribute?.dimensions || ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setAttribute({ ...attribute, dimensions: event.target.value })
          }
          style={{ width: '140px' }}
        />
        <Label label='Example: "*,2,99"' />
      </div>
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
    </div>
  )
}
