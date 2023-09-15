import {
  EBlueprint,
  EntityView,
  ErrorResponse,
  Stack,
  getKey,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { add, delete_forever } from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { useRegistryContext } from '../context/RegistryContext'
import { ButtonRow } from '../styles'
import { TArrayFieldProps } from '../types'
import { isPrimitive } from '../utils'
import { AttributeField } from './AttributeField'

const isPrimitiveType = (value: string): boolean => {
  return ['string', 'number', 'integer', 'boolean'].includes(value)
}

export default function ArrayField(props: TArrayFieldProps) {
  const { namePath, displayLabel, type, uiAttribute, dimensions, readOnly } =
    props

  const { idReference, onOpen } = useRegistryContext()
  const dmssAPI = useDMSS()
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePath,
  })
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')

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
            updateUncontained: false,
          })
          .then(() => {
            append(newEntity.data)
          })
          .catch((error: AxiosError<ErrorResponse>) => {
            console.error(error)
          })
      })
  }

  if (onOpen && !uiAttribute?.showInline && !isPrimitiveType(type)) {
    return (
      <ButtonRow>
        <Typography bold={true}>{displayLabel}</Typography>
        <OpenObjectButton
          viewId={namePath}
          view={{
            type: 'ReferenceViewConfig',
            scope: namePath,
            recipe: uiRecipeName,
          }}
        />
      </ButtonRow>
    )
  }

  if (!isPrimitiveType(type)) {
    return (
      <Stack spacing={0.5} alignItems="flex-start">
        <Typography bold={true}>{displayLabel}</Typography>
        <EntityView
          recipeName={uiRecipeName}
          idReference={`${idReference}.${namePath}`}
          type={type}
          onOpen={onOpen}
          dimensions={dimensions}
        />
      </Stack>
    )
  }

  return (
    <Stack spacing={0.5} alignItems="flex-start">
      <ButtonRow>
        <Typography bold={true}>{displayLabel}</Typography>
        {!readOnly && (
          <Tooltip title="Add">
            <Button
              variant="ghost_icon"
              aria-label="Add"
              data-testid={`add-${namePath}`}
              onClick={() => {
                if (isPrimitiveType(type)) {
                  const defaultValue = isPrimitive(type) ? ' ' : {}
                  append(defaultValue)
                } else {
                  handleAddObject()
                }
              }}
            >
              <Icon data={add} />
            </Button>
          </Tooltip>
        )}
      </ButtonRow>
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
                  name: item.id,
                  type: EBlueprint.ATTRIBUTE,
                }}
                readOnly={readOnly}
              />
            </Stack>
            {!readOnly && (
              <Tooltip title="Remove">
                <Button
                  variant="ghost_icon"
                  type="button"
                  aria-label="Remove"
                  onClick={() => remove(index)}
                >
                  <Icon data={delete_forever} />
                </Button>
              </Tooltip>
            )}
          </Stack>
        )
      })}
    </Stack>
  )
}
