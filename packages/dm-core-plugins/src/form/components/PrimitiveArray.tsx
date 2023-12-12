import { Tooltip } from '@equinor/eds-core-react'
import React, { useState } from 'react'
import { AttributeField } from '../fields/AttributeField'
import { TPrimitive, TUiAttributeObject } from '../types'
import {
  DeleteSoftButton,
  TAttribute,
  AddRowButton,
} from '@development-framework/dm-core'

interface PrimitiveArrayProps {
  uiAttribute: TUiAttributeObject | undefined
  attribute: TAttribute
  data: TPrimitive[]
  namePath: string
  onChange: (data: TPrimitive[]) => void
}

const getDefaultValue = (type: string): string | boolean | number => {
  switch (type) {
    case 'boolean':
      return true
    case 'number':
      return 0
    default:
      return ''
  }
}

const PrimitiveArray = ({
  data,
  attribute,
  uiAttribute,
  namePath,
  onChange,
}: PrimitiveArrayProps) => {
  const [hovering, setHovering] = useState<number>(-1)

  const updateValues = (
    index: number,
    newValue: boolean | string | number
  ): void => {
    const newValues = [...data]
    switch (attribute.attributeType) {
      case 'boolean':
        newValues[index] = newValue
        onChange(newValues)
        break
      case 'number':
        newValues[index] = Number(newValue) ?? 0
        onChange(newValues)
        break
      default:
        newValues[index] = newValue
        onChange(newValues)
    }
  }
  const removeItem = (index: number) => {
    const newValues = [...data]
    newValues.splice(index, 1)
    onChange(newValues)
  }

  return (
    <div
      className='
    flex
    flex-col
    max-h-96
    w-full
    content-start
    overflow-y-auto
    overflow-x-hidden
    pb-2
  '
    >
      <div className='w-fit border rounded-md border-[#6f6f6f]'>
        <div className='bg-[#f7f7f7] h-5 rounded-t-md border-b border-[#6f6f6f]'></div>
        <div className=''>
          {data.map((item: TPrimitive, index: number) => (
            <Tooltip
              title={`Index: ${index}`}
              placement={'right-start'}
              enterDelay={300}
              key={`${index}-${item}`}
            >
              <div
                className='flex items-center m-0.5'
                onMouseEnter={() => setHovering(index)}
                onMouseLeave={() => setHovering(-1)}
              >
                <AttributeField
                  namePath={`${namePath}.${index}`}
                  uiAttribute={{
                    name: '',
                    type: '',
                    ...uiAttribute,
                    config: { hideLabel: true, ...uiAttribute?.config },
                  }}
                  attribute={{ ...attribute, dimensions: '' }}
                />
                <DeleteSoftButton
                  onClick={() => removeItem(index)}
                  title={'Remove list item'}
                  ariaLabel='remove-action'
                  dataTestId={`form-primitive-array-remove-${index}`}
                  visibilityWhenNotHover={'opaque'}
                />
              </div>
            </Tooltip>
          ))}
        </div>
        <div className='ps-30 border-0'>
          <AddRowButton
            ariaLabel='Add new row'
            onClick={() =>
              updateValues(
                data.length,
                getDefaultValue(attribute.attributeType)
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export default PrimitiveArray
