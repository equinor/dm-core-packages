import {
  EBlueprint,
  EntityView,
  ErrorResponse,
  getKey,
  Stack,
  useDMSS,
} from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { add, delete_forever } from '@equinor/eds-icons'
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
  const { namePath, displayLabel, type, uiAttribute, dimensions } = props
  const { idReference, onOpen } = useRegistryContext()
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
      </Legend>
      <EntityView
        recipeName={uiRecipeName}
        idReference={`${idReference}.${namePath}`}
        type={type}
        onOpen={onOpen}
        dimensions={dimensions}
      />
    </Fieldset>
  )
}

const PrimitiveList = (props: TArrayFieldProps) => {
  const { namePath, displayLabel, type, readOnly } = props

  const { idReference } = useRegistryContext()
  const dmssAPI = useDMSS()
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePath,
  })

  const handleAddObject = () => {
    dmssAPI
      .instantiateEntity({
        entity: { type: type as string },
      })
      .then((newEntity: any) => {
        const data = JSON.stringify([...fields, newEntity.data])
        dmssAPI
          .documentUpdate({
            idAddress: `${idReference}.${namePath}`,
            data: data,
          })
          .then(() => {
            append(newEntity.data)
          })
          .catch((error: AxiosError<ErrorResponse>) => {
            console.error(error)
          })
      })
  }

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
        {!readOnly && (
          <TooltipButton
            title="Add"
            button-variant="ghost_icon"
            button-onClick={() => {
              if (isPrimitiveType(type)) {
                const defaultValue = isPrimitive(type) ? ' ' : {}
                append(defaultValue)
              } else {
                handleAddObject()
              }
            }}
            icon={add}
          />
        )}
      </Legend>
      {fields.map((item: any, index: number) => {
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
                namePath={`${namePath}.${index}`}
                attribute={{
                  attributeType: type,
                  dimensions: '',
                  name: '',
                  type: EBlueprint.ATTRIBUTE,
                }}
                readOnly={readOnly}
              />
            </Stack>
            {!readOnly && (
              <TooltipButton
                title="Remove"
                button-variant="ghost_icon"
                button-onClick={() => remove(index)}
                icon={delete_forever}
              />
            )}
          </Stack>
        )
      })}
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
