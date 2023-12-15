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

const getDefaultValue = (type: string): TPrimitive => {
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

  const updateValues = (index: number, newValue: TPrimitive): void => {
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
    w-full
    content-start
    overflow-x-hidden
    pb-2
    justify-center
  '
    >
      <div
        className='w-fit border rounded-t-sm rounded-b-md border-equinor-charcoal]
'
      >
        <div className='bg-equinor-light-gray-background'>
          {!data.length && <div className='h-3 w-10'></div>}
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
                <div
                  className={`pb-[3px] w-fit ${
                    typeof item !== 'boolean'
                      ? 'border-b border-equinor-charcoal'
                      : ''
                  }`}
                >
                  <DeleteSoftButton
                    onClick={() => removeItem(index)}
                    title={'Remove list item'}
                    ariaLabel='remove-action'
                    dataTestId={`form-primitive-array-remove-${index}`}
                    visibilityWhenNotHover={'opaque'}
                  />
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
        <div className='ps-30 border-t'>
          <AddRowButton
            ariaLabel='Append primitive'
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
