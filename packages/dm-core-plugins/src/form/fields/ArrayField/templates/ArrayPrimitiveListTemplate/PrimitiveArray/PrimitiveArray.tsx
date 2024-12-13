import type { TAttribute } from '@development-framework/dm-core'
import { Tooltip } from '@equinor/eds-core-react'
import { useFormContext } from 'react-hook-form'
import { AddRowButton, DeleteSoftButton, Stack } from '../../../../../../common'
import type { TPrimitive, TUiAttributeObject } from '../../../../../types'
import { AttributeFieldSelector } from '../../../../AttributeFieldSelector'

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

export const PrimitiveArray = ({
  data,
  attribute,
  uiAttribute,
  namePath,
  onChange,
}: PrimitiveArrayProps) => {
  const { getValues } = useFormContext()

  const addItem = (): void => {
    const newValue = getDefaultValue(attribute.attributeType)
    const newValues = getValues(namePath) || []
    newValues.push(newValue)
    onChange(newValues)
  }
  const removeItem = (index: number) => {
    const newValues = getValues(namePath) || []
    newValues.splice(index, 1)
    onChange(newValues)
  }

  return (
    <Stack>
      {data.map((item: TPrimitive, index: number) => (
        <Tooltip
          key={`${index}-${item}`}
          title={`Index: ${index}`}
          placement={'right-start'}
          enterDelay={300}
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            padding={0.25}
          >
            <AttributeFieldSelector
              namePath={`${namePath}.${index}`}
              uiAttribute={{
                name: '',
                type: '',
                ...uiAttribute,
                tooltip: '',
                config: {
                  hideLabel: true,
                  ...uiAttribute?.config,
                },
              }}
              attribute={{ ...attribute, dimensions: '' }}
            />
            <DeleteSoftButton
              onClick={() => removeItem(index)}
              title={'Remove list item'}
              ariaLabel='remove-action'
              dataTestId={`form-primitive-array-remove-${index}`}
              visibility='opaque'
            />
          </Stack>
        </Tooltip>
      ))}
      <AddRowButton ariaLabel='Add new item to list' onClick={addItem} />
    </Stack>
  )
}
