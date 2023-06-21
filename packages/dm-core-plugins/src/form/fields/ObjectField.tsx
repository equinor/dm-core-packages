import {
  EntityPickerButton,
  EntityView,
  ErrorResponse,
  Loading,
  NewEntityButton,
  Stack,
  TGenericObject,
  TLinkReference,
  useBlueprint,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../RegistryContext'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { TObjectFieldProps } from '../types'
import { AttributeField } from './AttributeField'

const AddUncontained = (props: {
  type: string
  namePath: string
  onAdd: (referenceObject: TLinkReference) => void
}) => {
  const { type, namePath, onAdd } = props
  const handleSelect = (referenceObject: TLinkReference | TGenericObject) => {
    onAdd(referenceObject as TLinkReference)
  }

  const handleAdd = (entity: any) => {
    onAdd(entity)
  }

  return (
    <Stack direction="row" spacing={1}>
      <EntityPickerButton
        data-testid={`select-${namePath}`}
        returnLinkReference={true}
        onChange={handleSelect}
      />
      {/*TODO fix hook error and add support for updated reference type in NewEntityButton  component*/}
      <NewEntityButton
        data-testid={`new-entity-${namePath}`}
        onCreated={handleAdd}
        type={type}
      />
    </Stack>
  )
}

const AddObject = (props: any) => {
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
            idReference: `${idReference}.${namePath}`,
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

const RemoveObject = (props: any) => {
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

export const orderAttributes = (
  attributes: string[],
  order: string[] | null
) => {
  if (order == null) {
    return attributes
  }
  if (order.filter((x) => x === '*').length > 1) {
    throw new Error('The config.order list contains more than one wildcard')
  }

  const orderFiltered = order.filter((x) => x === '*' || attributes.includes(x))
  const rest = attributes.filter((prop: any) => !orderFiltered.includes(prop))
  const restIndex = orderFiltered.indexOf('*')
  if (restIndex === -1) {
    if (rest.length) {
      throw new Error(`The config.order list does not include all properties`)
    }
    return orderFiltered
  }

  const complete = [...orderFiltered]
  complete.splice(restIndex, 1, ...rest)
  return complete
}

const AttributeList = (props: any) => {
  const { namePath, config, blueprint } = props

  const prefix = namePath === '' ? `` : `${namePath}.`

  const attributeNames = blueprint.attributes.map(
    (attribute: any) => attribute.name
  )
  const orderedAttributesNames = orderAttributes(
    attributeNames,
    (config && config.order) || null
  )

  const attributeFields =
    blueprint &&
    orderedAttributesNames.map((attributeName: any) => {
      const attribute = blueprint.attributes.find(
        (attribute: any) => attribute.name == attributeName
      )
      const uiAttribute =
        config &&
        config.attributes &&
        config.attributes.find(
          (uiAttribute: any) => uiAttribute.name === attribute.name
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

const External = (props: any) => {
  const { type, namePath, contained = true, idReference } = props

  const { getValues } = useFormContext()
  const { onOpen } = useRegistryContext()

  const initialValue = getValues(namePath) || {
    type: type,
  }

  return (
    <EntityView
      key={namePath}
      idReference={contained ? `${idReference}.${namePath}` : idReference}
      type={initialValue.type}
      onOpen={onOpen}
    />
  )
}

export const ContainedAttribute = (props: any): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    contained = true,
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

  const attributePath = idReference?.split('.', 2).slice(1)

  return (
    <div>
      <Stack spacing={0.25} alignItems="flex-start">
        <Typography bold={true}>{displayLabel}</Typography>
        {!isDefined && (
          <AddObject
            idReference={idReference}
            contained={contained}
            namePath={namePath}
            type={type}
            onAdd={() => setIsDefined(true)}
          />
        )}
        {shouldOpen && isDefined && (
          <OpenObjectButton
            namePath={
              attributePath.length > 1
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
              type={type}
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
            <External {...props} idReference={idReference} />
          )}
          {(isRoot ||
            uiRecipe === null ||
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

export const UncontainedAttribute = (props: any): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    contained = false,
    config,
    uiRecipe,
  } = props
  const { getValues, control, setValue } = useFormContext()
  const { dataSourceId, onOpen } = useRegistryContext()
  const initialValue = getValues(namePath)

  return (
    <Stack spacing={0.5}>
      <Typography bold={true}>{displayLabel}</Typography>
      <Controller
        name={namePath}
        control={control}
        defaultValue={initialValue}
        render={({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          field: { ref, onChange, value },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          fieldState: { invalid, error },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          formState,
        }) => {
          if (value && value.address && value.referenceType === 'link') {
            return (
              <div>
                <Stack spacing={0.25} alignItems="flex-start">
                  <Typography>Id: {value.address}</Typography>
                  <Stack direction="row" spacing={1}>
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
                    {onOpen && <OpenObjectButton namePath={namePath} />}
                    {!onOpen && (
                      <External
                        type={type}
                        namePath={namePath}
                        config={uiRecipe ? uiRecipe.config : config}
                        contained={contained}
                        dataSourceId={dataSourceId}
                        documentId={value.address}
                        onOpen={onOpen}
                        f
                      />
                    )}
                  </Stack>
                </Stack>
              </div>
            )
          } else {
            const handleAdd = (entity: any) => onChange(entity)

            return (
              <AddUncontained
                type={type}
                namePath={namePath}
                onAdd={handleAdd}
              />
            )
          }
        }}
      />
    </Stack>
  )
}

export const ObjectField = (props: TObjectFieldProps): JSX.Element => {
  const { type, namePath, uiAttribute } = props
  const { getValues } = useFormContext()
  const { getWidget } = useRegistryContext()

  // Be able to override the object field
  const Widget =
    uiAttribute && uiAttribute.widget
      ? getWidget(namePath, uiAttribute.widget)
      : ObjectTypeSelector

  const values = getValues(namePath)
  // If the attribute type is an object, we need to find the correct type from the values.
  return (
    <Widget
      {...props}
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
  const uiRecipe = uiRecipeName
    ? uiRecipes.find((uiRecipe: any) => uiRecipe.name === uiRecipeName)
    : null

  const Content = contained ? ContainedAttribute : UncontainedAttribute
  return (
    <Content
      type={type}
      namePath={namePath}
      displayLabel={displayLabel}
      optional={optional}
      contained={contained}
      config={config}
      blueprint={blueprint}
      uiRecipe={uiRecipe}
    />
  )
}
