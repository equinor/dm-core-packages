import { TArrayTemplate } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { Fieldset, Legend } from '../styles'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import TooltipButton from '../../common/TooltipButton'
import {
  add,
  chevron_down,
  chevron_up,
  remove_outlined,
} from '@equinor/eds-icons'
import { AttributeField } from '../fields/AttributeField'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import { DeleteSoftButton } from '@development-framework/dm-core'

function getDefaultValue(type: string): string | boolean | number {
  switch (type) {
    case 'boolean':
      return true
    case 'number':
      return 0
    default:
      return ''
  }
}

export const ArrayPrimitiveTemplate = (
  props: TArrayTemplate & {
    value: unknown[]
    onChange: (v: unknown[]) => void
  }
) => {
  const { namePath, attribute, uiAttribute, value, onChange } = props

  const { config } = useRegistryContext()
  const [hovering, setHovering] = useState<number>(-1)
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )

  const updateValues = (
    index: number,
    newValue: boolean | string | number
  ): void => {
    const newValues = [...value]
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
    const newValues = [...value]
    newValues.splice(index, 1)
    onChange(newValues)
  }
  // TODO:
  // const insertItem = () => {}
  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        <TooltipButton
          title={isExpanded ? 'Collapse' : 'Expand'}
          button-variant='ghost_icon'
          button-onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? chevron_up : chevron_down}
        />
        {!config.readOnly && isExpanded && (
          <TooltipButton
            title='Add'
            button-variant='ghost_icon'
            button-onClick={() =>
              updateValues(
                value.length,
                getDefaultValue(attribute.attributeType)
              )
            }
            icon={add}
          />
        )}
      </Legend>
      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            maxHeight: '26em',
            alignContent: 'flex-start',
            overflowY: 'auto',
            padding: '0 0 7px 0',
            overflowX: 'hidden',
            width: 'fit-content',
          }}
        >
          {value.map((item: any, index: number) => (
            <Tooltip
              title={`Index: ${index}`}
              placement={'right-start'}
              enterDelay={300}
              key={`${index}-${item}`}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: '1px',
                }}
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
            variant='outlined'
            onClick={() =>
              updateValues(
                value.length,
                getDefaultValue(attribute.attributeType)
              )
            }
          >
            <Icon data={add} />
          </Button>
        </div>
      )}
    </Fieldset>
  )
}
