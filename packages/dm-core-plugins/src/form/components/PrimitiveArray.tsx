import {
  AddRowButton,
  DeleteSoftButton,
  TAttribute,
} from '@development-framework/dm-core'
import { Tooltip } from '@equinor/eds-core-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AttributeField } from '../fields/AttributeField'
import { TPrimitive, TUiAttributeObject } from '../types'

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
  const { getValues } = useFormContext()

  const updateValues = (index: number, newValue: TPrimitive): void => {
    const newValues = getValues(namePath) || []
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
    const newValues = getValues(namePath) || []
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
    justify-center
  '
    >
      <div
        className='w-full rounded-b-md border-equinor-charcoal]
'
      >
        <div>
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
                    tooltip: '',
                    config: {
                      hideLabel: true,
                      ...uiAttribute?.config,
                      backgroundColor: 'white',
                    },
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
