import {
  EBlueprint,
  EntityView,
  getKey,
  Stack,
} from '@development-framework/dm-core'
import { Icon, Pagination, Typography } from '@equinor/eds-core-react'
import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  add,
  remove_outlined,
  chevron_down,
  chevron_up,
} from '@equinor/eds-icons'
import TooltipButton from '../../common/TooltipButton'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { useRegistryContext } from '../context/RegistryContext'
import { Fieldset, Legend } from '../styles'
import { TArrayFieldProps } from '../types'
import { isPrimitive } from '../utils'
import { AttributeField } from './AttributeField'
import RemoveObject from '../components/RemoveObjectButton'
import AddObject from '../components/AddObjectButton'

const isPrimitiveType = (value: string): boolean => {
  return ['string', 'number', 'integer', 'boolean'].includes(value)
}

const InlineList = (props: TArrayFieldProps) => {
  const {
    namePath,
    displayLabel,
    type,
    uiAttribute,
    dimensions,
    showExpanded,
  } = props
  const { idReference, onOpen } = useRegistryContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : showExpanded
  )
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
        <TooltipButton
          title="Expand"
          button-variant="ghost_icon"
          button-onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? chevron_up : chevron_down}
        />
      </Legend>
      {isExpanded && (
        <EntityView
          recipeName={uiRecipeName}
          idReference={`${idReference}.${namePath}`}
          type={type}
          onOpen={onOpen}
          dimensions={dimensions}
        />
      )}
    </Fieldset>
  )
}

const PrimitiveList = (props: TArrayFieldProps) => {
  const { namePath, displayLabel, type, readOnly, uiAttribute, showExpanded } =
    props

  const { control } = useFormContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : showExpanded
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
        <Typography bold={true}>{displayLabel}</Typography>
        <TooltipButton
          title="Expand"
          button-variant="ghost_icon"
          button-onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? chevron_up : chevron_down}
        />
        {!readOnly && isExpanded && (
          <TooltipButton
            title="Add"
            button-variant="ghost_icon"
            button-onClick={() => {
              if (type === 'boolean') {
                append(true)
                return
              }
              append(isPrimitive(type) ? ' ' : {})
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
                      attribute={{
                        attributeType: type,
                        dimensions: '',
                        name: '',
                        type: EBlueprint.ATTRIBUTE,
                      }}
                      readOnly={readOnly}
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

const OpenList = (props: TArrayFieldProps) => {
  const { namePath, displayLabel, type, uiAttribute, readOnly } = props

  const { getValues, setValue } = useFormContext()
  const [initialValue, setInitialValue] = useState(getValues(namePath))
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
  const isDefined = initialValue !== undefined

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
        {!readOnly &&
          (isDefined ? (
            <RemoveObject
              namePath={namePath}
              onRemove={() => {
                setInitialValue(undefined)
                setValue(namePath, undefined)
              }}
            />
          ) : (
            <AddObject
              namePath={namePath}
              type={type}
              defaultValue={[]}
              onAdd={() => setInitialValue([])}
            />
          ))}
        {!readOnly && isDefined && (
          <OpenObjectButton
            viewId={namePath}
            viewConfig={{
              type: 'ReferenceViewConfig',
              scope: namePath,
              recipe: uiRecipeName,
            }}
          />
        )}
      </Legend>
    </Fieldset>
  )
}

export default function ArrayField(props: TArrayFieldProps) {
  const { type, uiAttribute } = props

  const { onOpen } = useRegistryContext()

  if (isPrimitiveType(type)) return <PrimitiveList {...props} />

  if (onOpen && !uiAttribute?.showInline) {
    return <OpenList {...props} />
  }
  return <InlineList {...props} />
}
