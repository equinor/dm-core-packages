import {
  EBlueprint,
  EntityPickerDialog,
  EntityView,
  ErrorResponse,
  getKey,
  Loading,
  resolveRelativeAddress,
  splitAddress,
  TBlueprint,
  TLinkReference,
  useBlueprint,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'
import { add, delete_forever, edit } from '@equinor/eds-icons'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import TooltipButton from '../../common/TooltipButton'
import { defaultConfig } from '../FormPlugin'
import { AttributeList } from '../components/AttributeList'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { useRegistryContext } from '../context/RegistryContext'
import { getWidget } from '../context/WidgetContext'
import { Fieldset, Legend } from '../styles'
import {
  TAttributeConfig,
  TContentProps,
  TObjectFieldProps,
  TUiRecipeForm,
} from '../types'

const SelectReference = (props: { type: string; namePath: string }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { setValue, watch } = useFormContext()
  const dmssAPI = useDMSS()
  const { idReference } = useRegistryContext()
  const value = watch(props.namePath)

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

    const request = value
      ? dmssAPI.documentUpdate({
          idAddress: `${idReference}.${props.namePath}`,
          data: JSON.stringify(reference),
          updateUncontained: false,
        })
      : dmssAPI.documentAdd({
          address: `${idReference}.${props.namePath}`,
          document: JSON.stringify(reference),
          updateUncontained: false,
        })
    request
      .then(() => {
        setValue(props.namePath, reference, options)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }

  return (
    <>
      <TooltipButton
        title={`${value ? 'Edit' : 'Add'} and save`}
        button-variant="ghost_icon"
        button-onClick={() => setShowModal(true)}
        icon={value ? edit : add}
      />
      <EntityPickerDialog
        data-testid={`select-${props.namePath}`}
        onChange={onChange}
        typeFilter={props.type}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  )
}

const AddObject = (props: {
  type: string
  namePath: string
  defaultValue: any
}) => {
  const { type, namePath, defaultValue } = props
  const { setValue } = useFormContext()
  const dmssAPI = useDMSS()
  const { idReference } = useRegistryContext()
  const handleAdd = () => {
    if (!defaultValue) {
      dmssAPI
        .instantiateEntity({
          entity: { type: type as string },
        })
        .then((newEntity: AxiosResponse<any>) => addDocument(newEntity.data))
    } else {
      addDocument(defaultValue)
    }
  }
  const addDocument = (document: any) => {
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
    dmssAPI
      .documentAdd({
        address: `${idReference}.${namePath}`,
        document: JSON.stringify(document),
        updateUncontained: false,
      })
      .then(() => {
        setValue(namePath, document, options)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }
  return (
    <TooltipButton
      title="Add and save"
      button-variant="ghost_icon"
      button-onClick={handleAdd}
      icon={add}
    />
  )
}

const RemoveObject = (props: { namePath: string; address?: string }) => {
  const { namePath, address } = props
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
      .documentRemove({
        address: address ? address : `${idReference}.${namePath}`,
      })
      .then(() => {
        setValue(namePath, {}, options)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }
  return (
    <TooltipButton
      title="Remove and save"
      button-variant="ghost_icon"
      button-onClick={onClick}
      icon={delete_forever}
    />
  )
}

export const StorageUncontainedAttribute = (props: {
  type: string
  namePath: string
  displayLabel: string
  optional: boolean
  blueprint: TBlueprint
  uiRecipe?: TUiRecipeForm
  readOnly?: boolean
  uiAttribute?: TAttributeConfig
}) => {
  const {
    namePath,
    uiRecipe,
    displayLabel,
    optional,
    type,
    readOnly,
    uiAttribute,
  } = props
  const { watch, setValue } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const { dataSource, documentPath } = splitAddress(idReference)

  const value = watch(namePath)
  const address = resolveRelativeAddress(
    value.address,
    documentPath,
    dataSource
  )
  const { document, isLoading } = useDocument<any>(address, 1)

  useEffect(() => {
    if (!isLoading && document) setValue(namePath, document)
  }, [document])

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
        {!readOnly && <SelectReference type={type} namePath={namePath} />}
        {optional && address && !readOnly && (
          <RemoveObject address={address} namePath={namePath} />
        )}
        {address && onOpen && !uiAttribute?.showInline && (
          <OpenObjectButton
            viewId={namePath}
            viewConfig={{
              type: 'ReferenceViewConfig',
              scope: '',
              recipe: uiRecipe?.name,
            }}
            idReference={address}
          />
        )}
      </Legend>
      {address && !(onOpen && !uiAttribute?.showInline) && (
        <EntityView
          idReference={address}
          type={type}
          recipeName={uiRecipe?.name}
          onOpen={onOpen}
        />
      )}
    </Fieldset>
  )
}

export const ContainedAttribute = (
  props: TContentProps
): React.ReactElement => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    uiAttribute,
    uiRecipe,
    blueprint,
    defaultValue,
    readOnly,
  } = props
  const { watch } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const value = watch(namePath)
  const isDefined = value && Object.keys(value).length > 0
  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
        {optional &&
          !readOnly &&
          (isDefined ? (
            <RemoveObject namePath={namePath} />
          ) : (
            <AddObject
              namePath={namePath}
              type={type}
              defaultValue={defaultValue}
            />
          ))}
        {isDefined && onOpen && !uiAttribute?.showInline && (
          <OpenObjectButton
            viewId={namePath}
            idReference={idReference}
            viewConfig={{
              type: 'ReferenceViewConfig',
              scope: namePath,
              recipe: uiRecipe?.name,
            }}
          />
        )}
      </Legend>
      {isDefined && !(onOpen && !uiAttribute?.showInline) && (
        <Inline
          type={type}
          namePath={namePath}
          blueprint={blueprint}
          uiRecipe={uiRecipe}
        />
      )}
    </Fieldset>
  )
}

const Inline = (props: {
  type: string
  namePath: string
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm | undefined
}): React.ReactElement => {
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
    <AttributeList
      namePath={namePath}
      config={uiRecipe?.config}
      blueprint={blueprint}
    />
  )
}

export const UncontainedAttribute = (
  props: TContentProps
): React.ReactElement => {
  const {
    type,
    namePath,
    displayLabel,
    uiAttribute,
    uiRecipe,
    optional,
    readOnly,
  } = props
  const { watch } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const value = watch(namePath)
  const { dataSource, documentPath } = splitAddress(idReference)
  const address =
    value && value.address && value.referenceType === 'link'
      ? resolveRelativeAddress(value.address, documentPath, dataSource)
      : undefined

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
        {!readOnly && <SelectReference type={type} namePath={namePath} />}
        {optional && address && !readOnly && (
          <RemoveObject namePath={namePath} />
        )}
        {address && onOpen && !uiAttribute?.showInline && (
          <OpenObjectButton
            viewId={namePath}
            viewConfig={{
              type: 'ReferenceViewConfig',
              scope: '',
              recipe: uiRecipe?.name,
            }}
            idReference={address}
          />
        )}
      </Legend>
      {address && !(onOpen && !uiAttribute?.showInline) && (
        <EntityView
          idReference={address}
          type={type}
          recipeName={uiRecipe?.name}
          onOpen={onOpen}
        />
      )}
    </Fieldset>
  )
}

export const ObjectField = (props: TObjectFieldProps): React.ReactElement => {
  const { type, namePath, uiAttribute, displayLabel, defaultValue } = props
  const { getValues } = useFormContext()

  // Be able to override the object field
  const Widget =
    uiAttribute && uiAttribute.widget
      ? getWidget(uiAttribute.widget)
      : ObjectTypeSelector
  const values = getValues(namePath)
  const valuesIsStorageReference =
    values !== undefined &&
    'referenceType' in values &&
    values['referenceType'] === 'storage'
  // If the attribute type is an object, we need to find the correct type from the values.

  return (
    <>
      <Widget
        {...props}
        id={valuesIsStorageReference ? values['address'] : namePath}
        label={displayLabel}
        type={values ? values.type : type}
        defaultValue={defaultValue}
      />
    </>
  )
}

export const ObjectTypeSelector = (
  props: TObjectFieldProps
): React.ReactElement => {
  const {
    type,
    namePath,
    displayLabel,
    optional,
    contained,
    uiAttribute,
    defaultValue,
    readOnly,
  } = props
  const { blueprint, uiRecipes, isLoading, error } = useBlueprint(type)
  const { watch } = useFormContext()
  const value = watch(namePath)
  if (isLoading) return <Loading />
  if (error) throw new Error(`Failed to fetch blueprint for '${type}'`)
  if (blueprint === undefined) return <div>Could not find the blueprint</div>
  const attributeIsStorageReference =
    value !== undefined &&
    'referenceType' in value &&
    value['referenceType'] === 'storage'

  // The nested objects uses ui recipes names that are passed down from parent configs.
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
  const uiRecipe: TUiRecipeForm | undefined = uiRecipes
    .map((x) => ({ ...x, config: { ...defaultConfig, ...x.config } }))
    .find((uiRecipe) => uiRecipe.name === uiRecipeName)

  const Content = attributeIsStorageReference
    ? StorageUncontainedAttribute
    : contained
    ? ContainedAttribute
    : UncontainedAttribute

  return (
    <Content
      type={type}
      namePath={namePath}
      displayLabel={displayLabel}
      optional={optional}
      blueprint={blueprint}
      uiRecipe={uiRecipe}
      uiAttribute={uiAttribute}
      defaultValue={defaultValue}
      readOnly={readOnly}
    />
  )
}
