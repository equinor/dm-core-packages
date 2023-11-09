import {
  BlueprintPicker,
  EPrimitiveTypes,
  INPUT_FIELD_WIDTH,
  IUIPlugin,
  Loading,
  Select,
  TBlueprint,
  TGenericObject,
  truncatePathString,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Accordion,
  Button,
  Icon,
  Input,
  Label,
  Switch,
  TextField,
} from '@equinor/eds-core-react'
import { add, delete_to_trash, save, undo } from '@equinor/eds-icons'
import styled from 'styled-components'

const Spacer = styled.div`
  margin-top: 15px;
`

type TAttribute = {
  type: string
  name: string
  attributeType: EAttributeTypes | string
  dimensions: string
  label: string
  default?: string | number | boolean | TGenericObject
  optional: boolean
  contained: boolean
}

enum EAttributeTypes {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
}

const Extends = (props: {
  formData: string[]
  setExtends: (data: any) => void
}) => {
  const { formData, setExtends } = props
  return (
    <>
      <Label label="Extends" />
      <ul>
        {formData.length ? (
          <>
            {formData.map((typeRef: string, index: number) => (
              <li key={index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {typeRef}
                  <Button
                    variant="ghost_icon"
                    color="danger"
                    onClick={() =>
                      setExtends(
                        formData.filter(
                          (typeToRemove: string) => typeToRemove !== typeRef
                        )
                      )
                    }
                  >
                    <Icon data={delete_to_trash} title="remove extend item" />
                  </Button>
                </div>
              </li>
            ))}
          </>
        ) : (
          <li>None</li>
        )}
      </ul>
      <div style={{ display: 'flex' }}>
        <BlueprintPicker
          onChange={(newBlueprint: string) =>
            setExtends([...formData, newBlueprint])
          }
          type={'button'}
          label={'Add extends'}
        />
      </div>
    </>
  )
}

const BlueprintAttribute = (props: {
  attribute: TAttribute
  setAttribute: (attr: TAttribute) => void
}) => {
  const { attribute, setAttribute } = props

  return (
    <div>
      <TextField
        id="name"
        label={'Name'}
        value={attribute?.name || ''}
        placeholder="Name of the attribute"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, name: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <TextField
        id="label"
        label={'Label'}
        value={attribute?.label || ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, label: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <div style={{ display: 'flex', alignItems: 'self-end' }}>
        <div style={{ display: 'block' }}>
          <Label label={'Type'} />
          <Select
            value={truncatePathString(attribute.attributeType)}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const newType = e.target.value
              setAttribute({
                ...attribute,
                attributeType: newType,
                default: newType === 'boolean' ? true : undefined,
              })
            }}
          >
            {Object.keys(EAttributeTypes).map((key) => {
              // Avoid duplication, as we are explicitly adding the formData value as well
              if (key === attribute.attributeType) return null
              return <option key={key}>{key}</option>
            })}
            <option key={attribute.attributeType}>
              {attribute.attributeType}
            </option>
          </Select>
        </div>
        {!['string', 'number', 'boolean'].includes(attribute.attributeType) && (
          <div style={{ marginLeft: '10px' }}>
            <BlueprintPicker
              label={'Select'}
              onChange={(selectedBlueprint: string) =>
                setAttribute({
                  ...attribute,
                  attributeType: selectedBlueprint,
                })
              }
              type={'button'}
            />
          </div>
        )}
      </div>
      <Spacer />
      <Label htmlFor="default" label="Default value" />
      {attribute.attributeType === 'boolean' ? (
        <>
          <Switch
            defaultChecked={!!attribute?.default ?? false}
            onChange={(e: any) =>
              setAttribute({ ...attribute, default: e.target.checked })
            }
          />
          {attribute.default ? String(attribute.default) : 'false'}
        </>
      ) : (
        <Input
          type={attribute.attributeType === 'number' ? 'number' : 'text'}
          id="default"
          value={attribute?.default || ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            let value: string | number = event.target.value
            if (attribute.attributeType == 'number') value = Number(value)
            setAttribute({ ...attribute, default: value })
          }}
          style={{ width: INPUT_FIELD_WIDTH }}
        />
      )}
      <Spacer />
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          id="dimensions"
          label={'Dimensions'}
          value={attribute?.dimensions || ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setAttribute({ ...attribute, dimensions: event.target.value })
          }
          style={{ width: '140px' }}
        />
        <Label label='Example: "*,2,99"' />
      </div>
      {!Object.values(EPrimitiveTypes).includes(attribute.attributeType) && (
        <Switch
          label="Contained"
          defaultChecked={attribute?.contained ?? true}
          onChange={(e: any) =>
            setAttribute({ ...attribute, contained: e.target.checked })
          }
        />
      )}
      <Switch
        label="Optional"
        defaultChecked={attribute?.optional ?? false}
        onChange={(e: any) =>
          setAttribute({ ...attribute, optional: e.target.checked })
        }
      />
    </div>
  )
}

export const BlueprintPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const { document, isLoading, updateDocument, error } =
    useDocument<TBlueprint>(idReference)
  const [formData, setFormData] = useState<any>({ ...document }) //TODO remove any type (requires TBlueprint to be updated)

  useEffect(() => {
    if (!document) return
    if (!document.attributes) {
      document.attributes = []
    }
    setFormData(document)
  }, [document])

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (!document || isLoading) return <Loading />

  return (
    <div style={{ margin: '10px', width: '100%' }}>
      <Spacer />
      <TextField
        id="name"
        label={'Name'}
        value={formData?.name || ''}
        placeholder="Name of the blueprint"
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
      <TextField
        id="description"
        label={'Description'}
        value={formData?.description || ''}
        multiline
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, description: event.target.value })
        }
      />
      <Spacer />
      <Label label="Attributes" />
      <Accordion>
        {Array.isArray(formData?.attributes) &&
          formData.attributes.map((attribute: any, index: number) => (
            <Accordion.Item key={index}>
              <Accordion.Header>
                {attribute.name} {truncatePathString(attribute.attributeType)}{' '}
                {attribute?.dimensions || '-'}
                {attribute?.contained === undefined ||
                attribute?.contained === true
                  ? 'Contained'
                  : 'Uncontained'}
                <Button
                  variant="ghost_icon"
                  color="danger"
                  onClick={(event) => {
                    formData.attributes.splice(index, 1)
                    setFormData({
                      ...formData,
                      attributes: [...formData.attributes],
                    })
                    event.stopPropagation() // Stop the Accordion header from registering the click event
                  }}
                >
                  <Icon data={delete_to_trash} title="remove attribute" />
                </Button>
              </Accordion.Header>
              <Accordion.Panel>
                <BlueprintAttribute
                  attribute={attribute}
                  setAttribute={(changedAttribute: any) => {
                    const newAttributes = [...formData.attributes]
                    newAttributes[index] = changedAttribute
                    setFormData({ ...formData, attributes: newAttributes })
                  }}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
      <div style={{ display: 'flex', justifyContent: 'end', margin: '5px' }}>
        <Button
          as="button"
          variant="outlined"
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
                },
              ],
            })
          }
        >
          <Icon data={add}></Icon>
          Add attribute
        </Button>
      </div>
      <div
        style={{
          justifyContent: 'space-around',
          display: 'flex',
          marginTop: '15px',
        }}
      >
        <Button
          as="button"
          variant="outlined"
          color="danger"
          onClick={() => setFormData({ ...document })}
        >
          <Icon data={undo} title="save action"></Icon>
          Reset
        </Button>
        <Button as="button" onClick={() => updateDocument(formData, true)}>
          <Icon data={save} title="save action"></Icon>
          Save
        </Button>
      </div>
    </div>
  )
}
