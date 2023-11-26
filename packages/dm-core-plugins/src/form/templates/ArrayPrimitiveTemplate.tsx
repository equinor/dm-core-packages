import { TArrayTemplate } from '../types'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { Fieldset, Legend } from '../styles'
import { Icon, Pagination, Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import TooltipButton from '../../common/TooltipButton'
import {
  add,
  chevron_down,
  chevron_up,
  remove_outlined,
} from '@equinor/eds-icons'
import { isPrimitive } from '../utils'
import { EBlueprint, Stack } from '@development-framework/dm-core'
import { AttributeField } from '../fields/AttributeField'

export const ArrayPrimitiveTemplate = (props: TArrayTemplate) => {
  const { namePath, attribute, uiAttribute } = props

  const { control } = useFormContext()
  const { config } = useRegistryContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePath,
  })
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const itemsPerPage = 30

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        <TooltipButton
          title="Expand"
          button-variant="ghost_icon"
          button-onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? chevron_up : chevron_down}
        />
        {!config.readOnly && isExpanded && (
          <TooltipButton
            title="Add"
            button-variant="ghost_icon"
            button-onClick={() => {
              if (attribute.attributeType === 'boolean') {
                append(true)
                return
              }
              append(isPrimitive(attribute.attributeType) ? ' ' : {})
            }}
            icon={add}
          />
        )}
      </Legend>
      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column wrap',
            maxHeight: '23em',
            alignContent: 'flex-start',
          }}
        >
          {fields
            .slice(
              currentPageIndex * itemsPerPage,
              currentPageIndex * itemsPerPage + itemsPerPage
            )
            .map((item: any, index: number) => {
              const pagedIndex = itemsPerPage * currentPageIndex + index
              return (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={0.5}
                  alignSelf="stretch"
                  alignItems="flex-end"
                >
                  <Stack grow={1}>
                    <AttributeField
                      namePath={`${namePath}.${pagedIndex}`}
                      uiAttribute={uiAttribute}
                      attribute={{
                        attributeType: attribute.attributeType,
                        dimensions: '',
                        name: '',
                        type: EBlueprint.ATTRIBUTE,
                      }}
                      leftAdornments={String(pagedIndex)}
                      rightAdornments={
                        <Icon
                          data={remove_outlined}
                          size={18}
                          // @ts-ignore
                          onClick={() => remove(pagedIndex)}
                          style={{ cursor: 'pointer' }}
                          data-testid={`form-text-widget-remove-${pagedIndex}`}
                        />
                      }
                    />
                  </Stack>
                </Stack>
              )
            })}
        </div>
      )}
      {isExpanded && fields.length > itemsPerPage && (
        <div>
          <Pagination
            totalItems={fields.length}
            itemsPerPage={itemsPerPage}
            defaultPage={currentPageIndex + 1}
            onChange={(e, p) => setCurrentPageIndex(p - 1)}
          />
        </div>
      )}
    </Fieldset>
  )
}
