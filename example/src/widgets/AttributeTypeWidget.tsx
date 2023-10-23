import React, { ChangeEvent } from 'react'

import { Label } from '@equinor/eds-core-react'
import { TWidget } from '@development-framework/dm-core-plugins/dist/form/types'
import {
  BlueprintPicker,
  Select,
  truncatePathString,
} from '@development-framework/dm-core'

enum EAttributeTypes {
  object = 'object',
  string = 'string',
  number = 'number',
  boolean = 'boolean',
}

const AttributeTypeWidget = (props: TWidget) => {
  const { onChange } = props
  const attributeType = props.value || ''

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'block' }}>
          <Label label={'attributeType'} />
          <Select
            value={truncatePathString(attributeType)}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onChange?.(e.target.value)
            }
          >
            {Object.keys(EAttributeTypes).map((key) => {
              return <option key={key}>{key}</option>
            })}
          </Select>
        </div>
        {!['string', 'number', 'boolean'].includes(attributeType) && (
          <div style={{ marginLeft: '10px' }}>
            <BlueprintPicker
              label={'select blueprint'}
              onChange={(selectedBlueprint: string) =>
                onChange?.(selectedBlueprint)
              }
              formData={attributeType != 'object' ? attributeType : ''}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AttributeTypeWidget
