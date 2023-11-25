import {
  EBlueprint,
  EntityPickerDialog,
  EntityView,
  ErrorResponse,
  getKey,
  Loading,
  resolveRelativeAddress,
  splitAddress,
  TLinkReference,
  useBlueprint,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'
import { add, chevron_down, chevron_up, edit } from '@equinor/eds-icons'
import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import TooltipButton from '../../common/TooltipButton'
import { defaultConfig } from '../FormPlugin'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { useRegistryContext } from '../context/RegistryContext'
import { getWidget } from '../context/WidgetContext'
import { Fieldset, Legend } from '../styles'
import { TContentProps, TObjectFieldProps, TUiRecipeForm } from '../types'
import RemoveObject from '../components/RemoveObjectButton'
import AddObject from '../components/AddObjectButton'

const SelectReference = (props: {
  attributeType: string
  namePath: string
}) => {
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
        })
      : dmssAPI.documentAdd({
          address: `${idReference}.${props.namePath}`,
          document: JSON.stringify(reference),
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
        typeFilter={props.attributeType}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  )
}

export const StorageUncontainedAttribute = (props: TContentProps) => {
  const { namePath, uiRecipe, displayLabel, attribute, uiAttribute } = props
  const { watch, setValue } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const { dataSource, documentPath } = splitAddress(idReference)
  const { config } = useRegistryContext()
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
        {!config.readOnly && (
          <SelectReference
            attributeType={attribute.attributeType}
            namePath={namePath}
          />
        )}
        {attribute.optional && address && !config.readOnly && (
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
          type={attribute.attributeType}
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
    namePath,
    displayLabel = '',
    uiAttribute,
    uiRecipe,
    attribute,
  } = props
  const { watch } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()

  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )
  const value = watch(namePath)
  const isDefined = value && Object.keys(value).length > 0
  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{displayLabel}</Typography>
        {attribute.optional &&
          !config.readOnly &&
          (isDefined ? (
            <RemoveObject namePath={namePath} />
          ) : (
            <AddObject
              namePath={namePath}
              type={attribute.attributeType}
              defaultValue={attribute.default}
            />
          ))}
        {isDefined && !(onOpen && !uiAttribute?.showInline) && (
          <TooltipButton
            title="Expand"
            button-variant="ghost_icon"
            button-onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? chevron_up : chevron_down}
          />
        )}
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
      {isDefined && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
        <EntityView
          recipeName={uiRecipe.name}
          idReference={`${idReference}.${namePath}`}
          type={attribute.attributeType}
          onOpen={onOpen}
        />
      )}
    </Fieldset>
  )
}

export const UncontainedAttribute = (
  props: TContentProps
): React.ReactElement => {
  const { namePath, displayLabel, uiAttribute, uiRecipe, attribute } = props
  const { watch } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )
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
        {!config.readOnly && (
          <SelectReference
            attributeType={attribute.attributeType}
            namePath={namePath}
          />
        )}
        {attribute.optional && address && !config.readOnly && (
          <RemoveObject namePath={namePath} />
        )}
        {address && !(onOpen && !uiAttribute?.showInline) && (
          <TooltipButton
            title="Expand"
            button-variant="ghost_icon"
            button-onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? chevron_up : chevron_down}
          />
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
      {address && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
        <EntityView
          idReference={address}
          type={attribute.attributeType}
          recipeName={uiRecipe?.name}
          onOpen={onOpen}
        />
      )}
    </Fieldset>
  )
}

export const ObjectField = (props: TObjectFieldProps): React.ReactElement => {
  const { namePath, uiAttribute, displayLabel, attribute } = props
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
    <Widget
      {...props}
      onChange={() => null}
      id={valuesIsStorageReference ? values['address'] : namePath}
      label={displayLabel}
      //type={attribute.type === 'object' && values ? values.type : type}
      //defaultValue={defaultValue}
      attribute={attribute}
    />
  )
}

export const ObjectTypeSelector = (
  props: TObjectFieldProps
): React.ReactElement => {
  const { namePath, displayLabel, uiAttribute, attribute } = props
  const { blueprint, uiRecipes, isLoading, error } = useBlueprint(
    attribute.attributeType
  )
  const { watch } = useFormContext()
  const value = watch(namePath)
  if (isLoading) return <Loading />
  if (error)
    throw new Error(
      `Failed to fetch blueprint for '${attribute.attributeType}'`
    )
  if (blueprint === undefined) return <div>Could not find the blueprint</div>
  const attributeIsStorageReference =
    value !== undefined &&
    'referenceType' in value &&
    value['referenceType'] === 'storage'

  // The nested objects uses ui recipes names that are passed down from parent configs.
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
  const uiRecipesWithDefaultConfig: TUiRecipeForm[] = uiRecipes.map((x) => ({
    ...x,
    config: { ...defaultConfig, ...x.config },
  }))

  let uiRecipe: TUiRecipeForm | undefined = uiRecipesWithDefaultConfig[0] // By default, use the first recipe in the list

  if (uiRecipeName) {
    // If there is a recipe specified in the config, select that.
    uiRecipe = uiRecipesWithDefaultConfig.find(
      (uiRecipe) => uiRecipe.name === uiRecipeName
    )
  }

  if (!uiRecipe)
    throw new Error(
      `No UiRecipe named "${uiRecipeName}" could be found for type "${attribute.attributeType}"`
    )

  const Content = attributeIsStorageReference
    ? StorageUncontainedAttribute
    : attribute.contained ?? true
    ? ContainedAttribute
    : UncontainedAttribute

  return (
    <Content
      attribute={attribute}
      namePath={namePath}
      displayLabel={displayLabel}
      blueprint={blueprint}
      uiRecipe={uiRecipe}
      uiAttribute={uiAttribute}
    />
  )
}
