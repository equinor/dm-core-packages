import { useFormContext } from 'react-hook-form'
import { ErrorResponse, useDMSS } from '@development-framework/dm-core'
import { useRegistryContext } from '../context/RegistryContext'
import { AxiosError, AxiosResponse } from 'axios'
import React from 'react'
import FormObjectTextButton from '../templates/shared/FormObjectTextButton'

const AddObject = (props: {
  type: string
  namePath: string
  defaultValue?: any
  onAdd?: () => void
}) => {
  const { type, namePath, defaultValue, onAdd } = props
  const { setValue } = useFormContext()
  const dmssAPI = useDMSS()
  const { idReference } = useRegistryContext()
  const handleAdd = () => {
    if (!defaultValue) {
      dmssAPI
        .instantiateEntity({
          entity: { type: type as string },
        })
        .then((newEntity: AxiosResponse<any>) => {
          addDocument(newEntity.data)
          onAdd && onAdd()
        })
    } else {
      addDocument(defaultValue)
      onAdd && onAdd()
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
      })
      .then(() => {
        setValue(namePath, document, options)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }
  return (
    <FormObjectTextButton
      onClick={handleAdd}
      buttonText={'Create new ' + namePath}
      title={'Select Entity'}
      tooltip={'Change Entity'}
      ariaLabel={'Select Entity'}
    />
  )
}

export default AddObject
