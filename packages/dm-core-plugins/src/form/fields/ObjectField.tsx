import {
  EBlueprint,
  EntityPickerButton,
  EntityView,
  ErrorResponse,
  Loading,
  Stack,
  TBlueprint,
  TLinkReference,
  getKey,
  resolveRelativeAddress,
  splitAddress,
  useBlueprint,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import { defaultConfig } from '../FormPlugin'
import { AttributeList } from '../components/AttributeList'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { useRegistryContext } from '../context/RegistryContext'
import { getWidget } from '../context/WidgetContext'
import { TContentProps, TObjectFieldProps, TUiRecipeForm } from '../types'

const SelectReference = (props: { type: string; namePath: string }) => {
  const { setValue } = useFormContext()
  const dmssAPI = useDMSS()
  const { idReference } = useRegistryContext()

  const onChange = (address: string) => {
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
    dmssAPI
      .documentAdd({
        address: `${idReference}.${props.namePath}`,
        document: JSON.stringify(reference),
        updateUncontained: false,
      })
      .then(() => {
        setValue(props.namePath, reference, options)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }

  return (
    <EntityPickerButton
      data-testid={`select-${props.namePath}`}
      onChange={onChange}
      buttonVariant="outlined"
      typeFilter={props.type}
      alternativeButtonText="Select and save"
    />
  )
}

const AddObject = (props: { type: string; namePath: string }) => {
  const { type, namePath } = props
  const { setValue } = useFormContext()
  const dmssAPI = useDMSS()
  const { idReference } = useRegistryContext()
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
        dmssAPI
          .documentAdd({
            address: `${idReference}.${namePath}`,
            document: JSON.stringify(newEntity.data),
            updateUncontained: false,
          })
          .then(() => {
            setValue(namePath, newEntity.data, options)
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

const RemoveObject = (props: { namePath: string }) => {
  const { namePath } = props
  const { setValue } = useFormContext()
  const { idReference } = useRegistryContext()
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

/*
 * Display a model contained attribute in the Form.
 * Note: if the model contained attribute is storage uncontained, it needs to be handled in a special way.
 */
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
  const { watch } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const value = watch(namePath)
  const isDefined = value && Object.keys(value).length > 0
  const attributeIsStorageReference =
    value !== undefined &&
    'referenceType' in value &&
    value['referenceType'] === 'storage'
  // console.log('attributeIsStorageReference', attributeIsStorageReference)
  // console.log('contained props', props)
  // console.log(
  //   'id red',
  //   attributeIsStorageReference
  //     ? value['address']
  //     : `${idReference}.${namePath}`
  // )
  return (
    <Stack spacing={0.25} alignItems="flex-start">
      <Typography bold={true}>{displayLabel}</Typography>
      {optional &&
        (isDefined ? (
          <RemoveObject namePath={namePath} />
        ) : (
          <AddObject namePath={namePath} type={type} />
        ))}
      {isDefined &&
        (onOpen && !uiAttribute?.showInline ? (
          <OpenObjectButton
            viewId={namePath}
            idReference={idReference}
            view={{
              type: 'ReferenceViewConfig',
              scope: namePath,
              recipe: uiRecipe?.name,
            }}
          />
        ) : (
          <Inline
            type={type}
            idReference={
              attributeIsStorageReference
                ? value['address']
                : `${idReference}.${namePath}`
            }
            blueprint={blueprint}
            uiRecipe={uiRecipe}
          />
        ))}
    </Stack>
  )
}

const Inline = (props: {
  type: string
  idReference: string
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm | undefined
}): JSX.Element => {
  const { onOpen } = useRegistryContext()
  const { type, idReference, uiRecipe, blueprint } = props
  if (
    uiRecipe &&
    uiRecipe.plugin !== '@development-framework/dm-core-plugins/form'
  ) {
    console.log('return entity view')
    return (
      <EntityView
        recipeName={uiRecipe.name}
        idReference={idReference}
        type={type}
        onOpen={onOpen}
      />
    )
  }
  console.log('return entity attr list')
  return (
    <Indent>
      <AttributeList
        namePath={idReference}
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
  const { type, namePath, displayLabel, uiAttribute, uiRecipe, optional } =
    props
  const { watch } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const value = watch(namePath)
  const { dataSource, documentPath } = splitAddress(idReference)
  const address =
    value && value.address && value.referenceType === 'link'
      ? resolveRelativeAddress(value.address, documentPath, dataSource)
      : undefined

  return (
    <Stack spacing={0.5}>
      <Typography bold={true}>{displayLabel}</Typography>
      {address && <Typography>Address: {value.address}</Typography>}
      <Stack direction="row" spacing={0.5}>
        <SelectReference type={type} namePath={namePath} />
        {optional && address && <RemoveObject namePath={namePath} />}
        {address && onOpen && !uiAttribute?.showInline && (
          <OpenObjectButton
            viewId={namePath}
            view={{
              type: 'ReferenceViewConfig',
              scope: '',
              recipe: uiRecipe?.name,
            }}
            idReference={address}
          />
        )}
      </Stack>
      {address && !(onOpen && !uiAttribute?.showInline) && (
        <EntityView
          idReference={address}
          type={type}
          recipeName={uiRecipe?.name}
          onOpen={onOpen}
        />
      )}
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
