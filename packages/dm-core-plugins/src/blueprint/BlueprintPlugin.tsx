import {
  INPUT_FIELD_WIDTH,
  IUIPlugin,
  Loading,
  TBlueprint,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Icon, TextField, Typography } from '@equinor/eds-core-react'
import { save, undo } from '@equinor/eds-icons'
import { isEqual } from 'lodash'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Stack } from '../common'
import { BlueprintAttributeList } from './BlueprintAttributeList'
import { Extends } from './Extends'

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
    <div className='dm-plugin-padding'>
      <Stack spacing={1}>
        <Typography variant='h2'>{document.name}</Typography>
        <Stack spacing={0.5}>
          <Typography as='label' htmlFor='blueprint-name' bold={true}>
            Name
          </Typography>
          <TextField
            id='blueprint-name'
            value={formData?.name || ''}
            placeholder='Name of the blueprint'
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: event.target.value })
            }
            style={{ width: INPUT_FIELD_WIDTH }}
          />
        </Stack>
        <Extends
          formData={formData?.extends || []}
          setExtends={(newExtends: string[]) =>
            setFormData({ ...formData, extends: newExtends })
          }
        />
        <Stack spacing={0.5}>
          <Typography as='label' htmlFor='blueprint-description' bold={true}>
            Description
          </Typography>
          <TextField
            id='blueprint-description'
            value={formData?.description || ''}
            multiline
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, description: event.target.value })
            }
          />
        </Stack>
        <BlueprintAttributeList formData={formData} setFormData={setFormData} />
        <Stack direction='row' spacing={0.5}>
          <Button
            variant='outlined'
            disabled={!dirtyState}
            onClick={() => setFormData(structuredClone(document))}
          >
            <Icon data={undo} />
          </Button>
          <Button
            disabled={!dirtyState}
            onClick={() =>
              updateDocument(
                { ...formData, attributes: withoutId(formData.attributes) },
                true
              )
            }
          >
            <Icon data={save} />
            Save
          </Button>
        </Stack>
      </Stack>
    </div>
  )
}
