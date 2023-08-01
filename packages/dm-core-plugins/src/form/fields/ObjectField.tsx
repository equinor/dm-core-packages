import {
  EBlueprint,
  EntityPickerButton,
  EntityView,
  ErrorResponse,
  Loading,
  NewEntityButton,
  Stack,
  TAttribute,
  TBlueprint,
  TLinkReference,
  resolveRelativeAddress,
  splitAddress,
  useBlueprint,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { defaultConfig } from '../FormPlugin'
import { useRegistryContext } from '../RegistryContext'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { getWidget } from '../context/WidgetContext'
import {
  TConfig,
  TContentProps,
  TObjectFieldProps,
  TUiRecipeForm,
} from '../types'
import { AttributeField } from './AttributeField'

const AddUncontained = (props: {
  type: string
  namePath: string
  onChange: (event: any) => void
}) => {
  const onChange = (entity: any) => {
    const reference: TLinkReference = {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: `$${entity['_id']}`,
    }
    props.onChange(reference)
  }

  return (
    <Stack direction="row" spacing={1}>
      <EntityPickerButton
        data-testid={`select-${props.namePath}`}
        returnLinkReference={true}
        onChange={onChange}
      />
      {/*TODO fix hook error and add support for updated reference type in NewEntityButton  component*/}
      <NewEntityButton
        data-testid={`new-entity-${props.namePath}`}
        onCreated={onChange}
        type={props.type}
      />
    </Stack>
  )
}

const AddObject = (props: {
  type: string
  namePath: string
  onAdd: () => void
  idReference: string
}) => {
  const { type, namePath, onAdd, idReference } = props
  const { setValue } = useFormContext()
  const dmssAPI = useDMSS()
  const handleAdd = () => {
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }

    dmssAPI
      .instantiateEntity({
        entity: { type: type as string },
      })
      .then((newEntity: AxiosResponse<any>) => {
        const data = JSON.stringify(newEntity.data)
        dmssAPI
          .documentUpdate({
            idAddress: `${idReference}.${namePath}`,
            data: data,
            updateUncontained: false,
          })
          .then((response: any) => {
            setValue(namePath, response.data.data, options)
            onAdd()
          })
          .catch((error: AxiosError<ErrorResponse>) => {
            console.error(error)
          })
      })
  }
  return (
    <Button
      variant="outlined"
      data-testid={`add-${namePath}`}
      onClick={handleAdd}
    >
      Add
    </Button>
  )
}

const RemoveObject = (props: { namePath: string; onRemove: () => void }) => {
  const { namePath, onRemove } = props
  const { setValue } = useFormContext()

  const handleAdd = () => {
    // TODO: Fill with default values using createEntity?
    const values = null
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
    setValue(namePath, values, options)
    onRemove()
  }
  return (
    <Button
      variant="outlined"
      data-testid={`remove-${namePath}`}
      onClick={handleAdd}
    >
      Remove
    </Button>
  )
}

export const AttributeList = (props: {
  namePath: string
  config: TConfig | undefined
  blueprint: TBlueprint | undefined
}) => {
  const { namePath, config, blueprint } = props

  const prefix = namePath === '' ? `` : `${namePath}.`

  const attributes = blueprint?.attributes ?? []
  const filteredAttributes =
    config && config.fields.length
      ? config.fields
          .map((name: string) =>
            attributes.find((attribute) => attribute.name == name)
          )
          .filter((attribute): attribute is TAttribute => !!attribute)
      : attributes

  const attributeFields = filteredAttributes.map((attribute) => {
    const uiAttribute = config?.attributes.find(
      (uiAttribute) => uiAttribute.name === attribute.name
    )
    return (
      <AttributeField
        key={`${prefix}${attribute.name}`}
        namePath={`${prefix}${attribute.name}`}
        attribute={attribute}
        uiAttribute={uiAttribute}
      />
    )
  })

  return <Stack spacing={1}>{attributeFields}</Stack>
}

export const ContainedAttribute = (props: TContentProps): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    config,
    uiRecipe,
    blueprint,
  } = props
  const { getValues, setValue } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const [isDefined, setIsDefined] = useState(
    namePath == ''
      ? getValues() !== undefined
      : getValues(namePath) !== undefined &&
          Object.keys(getValues(namePath)).length > 0
  )
  const hasOpen = onOpen !== undefined
  const isRoot = namePath == ''
  const shouldOpen = hasOpen && !isRoot

  const attributePath = idReference.split('.', 2).slice(1)

  return (
    <div>
      <Stack spacing={0.25} alignItems="flex-start">
        <Typography bold={true}>{displayLabel}</Typography>
        {!isDefined && (
          <AddObject
            idReference={idReference}
            namePath={namePath}
            type={type}
            onAdd={() => setIsDefined(true)}
          />
        )}
        {shouldOpen && isDefined && (
          <OpenObjectButton
            viewId={namePath}
            idReference={idReference}
            namePath={
              attributePath && attributePath.length > 1
                ? `${attributePath[1]}.${namePath}`
                : namePath
            }
          />
        )}
      </Stack>
      {!shouldOpen && isDefined && (
        <>
          {!isRoot && optional && (
            <RemoveObject
              namePath={namePath}
              onRemove={() => {
                const options = {
                  shouldValidate: false,
                  shouldDirty: true,
                  shouldTouch: true,
                }
                setValue(namePath, null, options)
              }}
            />
          )}
          {uiRecipe && uiRecipe.plugin !== 'form' && (
            <EntityView
              idReference={`${idReference}.${namePath}`}
              type={type}
              onOpen={onOpen}
            />
          )}
          {(isRoot ||
            uiRecipe === undefined ||
            (uiRecipe && uiRecipe.plugin === 'form')) && (
            <AttributeList
              namePath={namePath}
              config={uiRecipe ? uiRecipe.config : config}
              blueprint={blueprint}
            />
          )}
        </>
      )}
    </div>
  )
}

export const UncontainedAttribute = (props: TContentProps): JSX.Element => {
  const { type, namePath, displayLabel = '' } = props
  const { getValues, setValue } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const initialValue = getValues(namePath)

  return (
    <Stack spacing={0.5}>
      <Typography bold={true}>{displayLabel}</Typography>
      <Controller
        name={namePath}
        defaultValue={initialValue}
        render={({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          field: { onChange, value },
        }) => {
          if (value && value.address && value.referenceType === 'link') {
            const { dataSource, documentPath } = splitAddress(idReference)
            const id = resolveRelativeAddress(
              value.address,
              documentPath,
              dataSource
            )
            return (
              <div>
                <Stack spacing={0.25} alignItems="flex-start">
                  <Typography>Id: {value.address}</Typography>
                  <Stack spacing={1}>
                    <RemoveObject
                      namePath={namePath}
                      onRemove={() => {
                        const options = {
                          shouldValidate: false,
                          shouldDirty: true,
                          shouldTouch: true,
                        }
                        setValue(namePath, null, options)
                      }}
                    />
                    {onOpen && (
                      <OpenObjectButton
                        viewId={namePath}
                        namePath=""
                        idReference={id}
                      />
                    )}
                    {!onOpen && (
                      <EntityView
                        idReference={id}
                        type={type}
                        onOpen={onOpen}
                      />
                    )}
                  </Stack>
                </Stack>
              </div>
            )
          } else {
            return (
              <AddUncontained
                type={type}
                namePath={namePath}
                onChange={onChange}
              />
            )
          }
        }}
      />
    </Stack>
  )
}

export const ObjectField = (props: TObjectFieldProps): JSX.Element => {
  const { type, namePath, uiAttribute, displayLabel } = props
  const { getValues } = useFormContext()

  // Be able to override the object field
  const Widget =
    uiAttribute && uiAttribute.widget
      ? getWidget(uiAttribute.widget)
      : ObjectTypeSelector

  const values = getValues(namePath)
  // If the attribute type is an object, we need to find the correct type from the values.
  return (
    <Widget
      {...props}
      id={namePath}
      label={displayLabel ?? ''}
      type={type === 'object' && values ? values.type : type}
    />
  )
}

export const ObjectTypeSelector = (props: TObjectFieldProps): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    contained = true,
    config,
    uiRecipeName,
  } = props

  const { blueprint, uiRecipes, isLoading, error } = useBlueprint(type)

  if (isLoading) return <Loading />
  if (error) throw new Error(`Failed to fetch blueprint for '${type}'`)
  if (blueprint === undefined) return <div>Could not find the blueprint</div>

  // The root object uses the ui recipe config that is passed into the ui plugin,
  // the nested objects uses ui recipes names that are passed down from parent configs.
  const uiRecipe: TUiRecipeForm | undefined = uiRecipes
    .map((x) => ({ ...x, config: { ...defaultConfig, ...x.config } }))
    .find((uiRecipe) => uiRecipe.name === uiRecipeName)

  const Content = contained ? ContainedAttribute : UncontainedAttribute
  return (
    <Content
      type={type}
      namePath={namePath}
      displayLabel={displayLabel}
      optional={optional}
      config={config}
      blueprint={blueprint}
      uiRecipe={uiRecipe}
    />
  )
}
