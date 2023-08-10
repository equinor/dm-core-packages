import {
  EBlueprint,
  EntityPickerButton,
  EntityView,
  ErrorResponse,
  Loading,
  Stack,
  TBlueprint,
  TLinkReference,
  TValidEntity,
  getKey,
  resolveRelativeAddress,
  splitAddress,
  useBlueprint,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import { defaultConfig } from '../FormPlugin'
import { AttributeList } from '../components/AttributeList'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { useRegistryContext } from '../context/RegistryContext'
import { getWidget } from '../context/WidgetContext'
import { TContentProps, TObjectFieldProps, TUiRecipeForm } from '../types'

const AddUncontained = (props: { type: string; namePath: string }) => {
  const { setValue } = useFormContext()
  const onChange = (address: string, entity: TValidEntity) => {
    const reference: TLinkReference = {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: address,
    }
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
    setValue(props.namePath, reference, options)
  }

  return (
    <EntityPickerButton
      data-testid={`select-${props.namePath}`}
      onChange={onChange}
      buttonVariant="outlined"
      typeFilter={props.type}
    />
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
      Add and save
    </Button>
  )
}

const RemoveObject = (props: {
  namePath: string
  onRemove: () => void
  idReference: string
}) => {
  const { namePath, onRemove, idReference } = props
  const { setValue } = useFormContext()
  const dmssAPI = useDMSS()

  const onClick = () => {
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
    dmssAPI
      .documentRemove({ address: `${idReference}.${namePath}` })
      .then(() => {
        // TODO: Fill with default values using createEntity?
        setValue(namePath, null, options)
        onRemove()
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }
  return (
    <Button
      variant="outlined"
      data-testid={`remove-${namePath}`}
      onClick={onClick}
    >
      Remove and save
    </Button>
  )
}

export const ContainedAttribute = (props: TContentProps): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    uiAttribute,
    uiRecipe,
    blueprint,
  } = props
  const { getValues, setValue } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const [isDefined, setIsDefined] = useState(
    getValues(namePath) !== undefined &&
      Object.keys(getValues(namePath)).length > 0
  )
  const hasOpen = onOpen !== undefined

  return (
    <Stack spacing={0.25} alignItems="flex-start">
      <Typography bold={true}>{displayLabel}</Typography>
      {optional &&
        (isDefined ? (
          <RemoveObject
            namePath={namePath}
            idReference={idReference}
            onRemove={() => {
              const options = {
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: true,
              }
              setValue(namePath, undefined, options)
              setIsDefined(false)
            }}
          />
        ) : (
          <AddObject
            idReference={idReference}
            namePath={namePath}
            type={type}
            onAdd={() => setIsDefined(true)}
          />
        ))}
      {isDefined &&
        (hasOpen && !uiAttribute?.showInline ? (
          <OpenObjectButton
            viewId={namePath}
            idReference={idReference}
            namePath={namePath}
          />
        ) : (
          <Inline
            type={type}
            namePath={namePath}
            blueprint={blueprint}
            uiRecipe={uiRecipe}
          />
        ))}
    </Stack>
  )
}

const Inline = (props: {
  type: string
  namePath: string
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm | undefined
}): JSX.Element => {
  const { idReference, onOpen } = useRegistryContext()
  const { type, namePath, uiRecipe, blueprint } = props
  if (
    uiRecipe &&
    uiRecipe.plugin !== '@development-framework/dm-core-plugins/form'
  ) {
    return (
      <EntityView
        recipeName={uiRecipe.name}
        idReference={`${idReference}.${namePath}`}
        type={type}
        onOpen={onOpen}
      />
    )
  }
  return (
    <Indent>
      <AttributeList
        namePath={namePath}
        config={uiRecipe?.config}
        blueprint={blueprint}
      />
    </Indent>
  )
}

const Indent = styled.div`
  border-left: 1px solid black;
  padding-left: 1rem;
`

export const UncontainedAttribute = (props: TContentProps): JSX.Element => {
  const { type, namePath, displayLabel, uiRecipe, uiAttribute } = props
  const { watch } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const value = watch(namePath)
  const { dataSource, documentPath } = splitAddress(idReference)

  const Content = () => {
    if (value && value.address && value.referenceType === 'link') {
      const id = resolveRelativeAddress(value.address, documentPath, dataSource)
      return (
        <Stack spacing={0.25} alignItems="flex-start">
          <Typography>Id: {value.address}</Typography>
          <RemoveObject
            namePath={namePath}
            idReference={idReference}
            onRemove={() => undefined}
          />
          {onOpen && !uiAttribute?.showInline ? ( // eslint-disable-line react/prop-types
            <OpenObjectButton viewId={namePath} namePath="" idReference={id} />
          ) : (
            <EntityView
              idReference={id}
              type={type}
              // eslint-disable-next-line react/prop-types
              recipeName={uiRecipe?.name}
              onOpen={onOpen}
            />
          )}
        </Stack>
      )
    } else {
      return <AddUncontained type={type} namePath={namePath} />
    }
  }

  return (
    <Stack spacing={0.5}>
      <Typography bold={true}>{displayLabel}</Typography>
      <Content />
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
      label={displayLabel}
      type={type === 'object' && values ? values.type : type}
    />
  )
}

export const ObjectTypeSelector = (props: TObjectFieldProps): JSX.Element => {
  const { type, namePath, displayLabel, optional, contained, uiAttribute } =
    props

  const { blueprint, uiRecipes, isLoading, error } = useBlueprint(type)

  if (isLoading) return <Loading />
  if (error) throw new Error(`Failed to fetch blueprint for '${type}'`)
  if (blueprint === undefined) return <div>Could not find the blueprint</div>

  // The nested objects uses ui recipes names that are passed down from parent configs.
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
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
      blueprint={blueprint}
      uiRecipe={uiRecipe}
      uiAttribute={uiAttribute}
    />
  )
}
