import React from 'react'

import { ErrorResponse, useDMSS } from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import { useFieldArray, useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import DynamicTable from '../components/DynamicTable'
import { useRegistryContext } from '../RegistryContext'
import { isPrimitive } from '../utils'
import { AttributeField } from './AttributeField'
import { OpenObject } from './ObjectField'

const Wrapper = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
  width: 100%;
`

const ItemWrapper = styled.div`
  display: flex;
`

const Stretch = styled.div`
  flex: 1 0 auto;
  margin-right: 10px;
  margin-bottom: 8px;
`

const Sticky = styled.div``

const FixedContainer = styled.div`
  max-height: 400px;
  overflow: auto;
`

const isPrimitiveType = (value: string): boolean => {
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(value)
}

export default function Fields(props: any) {
  const { namePath, displayLabel, type, uiAttribute } = props

  const { documentId, dataSourceId, onOpen } = useRegistryContext()
  const dmssAPI = useDMSS()
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePath,
  })

  const handleAddObject = () => {
    const name: string = `${namePath}-${fields.length}`
    dmssAPI
      .instantiateEntity({
        entity: { name: name, type: type as string },
      })
      .then((newEntity: any) => {
        const data = JSON.stringify([...fields, newEntity.data])
        dmssAPI
          .documentUpdate({
            idReference: `${documentId}.${namePath}`,
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
    const rows: Array<any> = []
    const columns =
      uiAttribute && uiAttribute.columns
        ? [...uiAttribute.columns, 'actions']
        : ['name', 'actions']
    fields.map((item: any, index: number) => {
      const row: any = {}
      columns.forEach((column: any) => (row[column] = item[column]))

      row['actions'] = (
        <div>
          <OpenObject
            type={type}
            namePath={`${namePath}.${index}`}
            contained={true}
            dataSourceId={dataSourceId}
            documentId={documentId}
            entity={item}
          />
          <Button
            variant="outlined"
            type="button"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      )

      rows.push(row)
    })

    return (
      <Wrapper>
        <Typography bold={true}>{displayLabel}</Typography>
        <FixedContainer>
          <DynamicTable columns={columns} rows={rows} />
        </FixedContainer>
        <Button
          variant="outlined"
          data-testid={`add-${namePath}`}
          onClick={() => {
            handleAddObject()
          }}
        >
          Add
        </Button>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Typography bold={true}>{displayLabel}</Typography>
      <FixedContainer>
        {fields.map((item: any, index: number) => {
          return (
            <ItemWrapper key={item.id}>
              <Stretch>
                <AttributeField
                  namePath={`${namePath}.${index}`}
                  attribute={{
                    attributeType: type,
                    dimensions: '',
                  }}
                />
              </Stretch>
              <Sticky>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </Sticky>
            </ItemWrapper>
          )
        })}
      </FixedContainer>

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
    </Wrapper>
  )
}
