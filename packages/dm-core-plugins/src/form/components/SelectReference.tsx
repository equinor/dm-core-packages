import {
  EBlueprint,
  EntityPickerDialog,
  ErrorResponse,
  TEntityPickerReturn,
  TLinkReference,
  useApplication,
} from '@development-framework/dm-core'
import { AxiosError } from 'axios/index'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import GhostTextButton from './GhostTextButton'

export const SelectReference = (props: {
  attributeType: string
  namePath: string
  buttonText?: string
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { setValue, watch } = useFormContext()
  const { dmssAPI } = useApplication()
  const { idReference } = useRegistryContext()
  const value = watch(props.namePath)

  const onChange = (v: TEntityPickerReturn) => {
    const reference: TLinkReference = {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: v.address,
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
      <GhostTextButton
        onClick={() => setShowModal(true)}
        buttonText={'Change'}
        title={'Select Entity'}
        tooltip={'Change Entity'}
        ariaLabel={'Select Entity'}
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
