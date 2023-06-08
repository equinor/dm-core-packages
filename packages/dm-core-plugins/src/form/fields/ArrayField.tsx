import React from 'react'
import { ErrorResponse, Stack, useDMSS } from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { useRegistryContext } from '../RegistryContext'
import { isPrimitive } from '../utils'
import { AttributeField } from './AttributeField'
import { OpenObjectButton } from '../components/OpenObjectButton'

const isPrimitiveType = (value: string): boolean => {
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(value)
}

export default function Fields(props: any) {
  const { namePath, displayLabel, type } = props

  const { idReference, onOpen } = useRegistryContext()
  const dmssAPI = useDMSS()
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePath,
  })

  const handleAddObject = () => {
    // const name: string = `${namePath}-${fields.length}`
    dmssAPI
      .instantiateEntity({
        entity: { type: type as string },
      })
      .then((newEntity: any) => {
        const data = JSON.stringify([...fields, newEntity.data])
        dmssAPI
          .documentUpdate({
            idReference: `${idReference}.${namePath}`,
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

  if (onOpen && !isPrimitiveType(type)) {
    return (
      <Stack spacing={0.25} alignItems="flex-start">
        <Typography bold={true}>{displayLabel}</Typography>
        <OpenObjectButton namePath={namePath} />
      </Stack>
    )
  }

  return (
    <Stack spacing={0.5} alignItems="flex-start">
      <Typography bold={true}>{displayLabel}</Typography>
      {fields.map((item: any, index: number) => {
        return (
          <Stack
            key={item.id}
            direction="row"
            spacing={0.5}
            alignSelf="stretch"
          >
            <Stack grow={1}>
              <AttributeField
                namePath={`${namePath}.${index}`}
                attribute={{
                  attributeType: type,
                  dimensions: '',
                }}
              />
            </Stack>
            <Button
              variant="outlined"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </Stack>
        )
      })}
      <Button
        variant="outlined"
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
        Add
      </Button>
    </Stack>
  )
}
