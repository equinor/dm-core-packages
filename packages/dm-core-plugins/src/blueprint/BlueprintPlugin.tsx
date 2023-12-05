import {
  INPUT_FIELD_WIDTH,
  IUIPlugin,
  Loading,
  TAttribute,
  TBlueprint,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Button, Icon, TextField, Typography } from '@equinor/eds-core-react'
import { add, save, undo } from '@equinor/eds-icons'
import styled from 'styled-components'
import { Extends } from './Extends'
import { BlueprintAttributeList } from './BlueprintAttributeList'
import { isEqual } from 'lodash'

export const Spacer = styled.div`
  margin-top: 20px;
`

const addId = (attributes: any[]) => {
  return attributes.map((attr) => ({ ...attr, _id: crypto.randomUUID() }))
}

const withoutId = (attributes: any[]) => {
  return attributes.map((attr: any) => {
    delete attr._id
    return attr
  })
}

export const BlueprintPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const { document, isLoading, updateDocument, error } =
    useDocument<TBlueprint>(idReference)
  const [formData, setFormData] = useState<any>({ ...document }) //TODO remove any type (requires TBlueprint to be updated)

  const dirtyState = useMemo(() => {
    return !isEqual(document, formData)
  }, [document, formData])

  useEffect(() => {
    if (!document) return
    if (!document.attributes) {
      document.attributes = []
    }
    setFormData({ ...document, attributes: addId(document.attributes) })
  }, [document])

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (!document || isLoading) return <Loading />

  return (
    <div className={'max-w-full m-2 w-full'}>
      <h1 className={'text-3xl'}>{document.name}</h1>
      <Spacer />
      <Typography className={'self-center pb-2'} bold={true}>
        Name
      </Typography>
      <TextField
        id='name'
        value={formData?.name || ''}
        placeholder='Name of the blueprint'
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, name: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <Extends
        formData={formData?.extends || []}
        setExtends={(newExtends: string[]) =>
          setFormData({ ...formData, extends: newExtends })
        }
      />
      <Spacer />
      <Typography className={'self-center pb-2'} bold={true}>
        Description
      </Typography>
      <TextField
        id='description'
        value={formData?.description || ''}
        multiline
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, description: event.target.value })
        }
      />
      <Spacer />
      <div className={'flex justify-start'}>
        <Typography className={'self-center'} bold={true}>
          Attributes
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'end', margin: '5px' }}>
          <Button
            as='button'
            variant='ghost_icon'
            onClick={() =>
              setFormData({
                ...formData,
                attributes: [
                  ...formData.attributes,
                  {
                    name: 'new-attribute',
                    attributeType: 'string',
                    type: 'dmss://system/SIMOS/BlueprintAttribute',
                    contained: true,
                    optional: true,
                    _id: crypto.randomUUID(),
                  },
                ],
              })
            }
          >
            <Icon data={add}></Icon>
          </Button>
        </div>
      </div>
      <BlueprintAttributeList formData={formData} setFormData={setFormData} />
      <div className={'flex justify-start space-x-2 mt-5'}>
        <Button
          as='button'
          variant='outlined'
          disabled={!dirtyState}
          onClick={() => setFormData(structuredClone(document))}
        >
          <Icon data={undo} title='save action'></Icon>
        </Button>
        <Button
          as='button'
          disabled={!dirtyState}
          onClick={() =>
            updateDocument(
              { ...formData, attributes: withoutId(formData.attributes) },
              true
            )
          }
        >
          <Icon data={save} title='save action'></Icon>
          Save
        </Button>
      </div>
    </div>
  )
}
