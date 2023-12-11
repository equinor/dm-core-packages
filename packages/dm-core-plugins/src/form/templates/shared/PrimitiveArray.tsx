import { Button, Icon, Tooltip } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import React, { useState } from 'react'
import { AttributeField } from '../../fields/AttributeField'
import { TUiAttributeObject } from '../../types'
import { DeleteSoftButton, TAttribute } from '@development-framework/dm-core'

interface PrimitiveArrayProps {
  uiAttribute: TUiAttributeObject | undefined
  attribute: TAttribute
  data: any
  namePath: string
  onChange: (data: any[]) => void
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
    w-fit
    content-start
    overflow-y-auto
    overflow-x-hidden
    pb-2
  '
    >
      {data.map((item: any, index: number) => (
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
            <DeleteSoftButton
              onClick={() => removeItem(index)}
              title={'Remove list item'}
              ariaLabel='remove-action'
              dataTestId={`form-primitive-array-remove-${index}`}
              visibilityWhenNotHover={'opaque'}
            />
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
          </div>
        </Tooltip>
      ))}
      <Button
        style={{ marginLeft: '30px' }}
        color='secondary'
        aria-label='Append primitive'
        title='Add primitive'
        variant='outlined'
        onClick={() =>
          updateValues(data.length, getDefaultValue(attribute.attributeType))
        }
      >
        <Icon data={add} />
      </Button>
    </div>
  )
}

export default PrimitiveArray
