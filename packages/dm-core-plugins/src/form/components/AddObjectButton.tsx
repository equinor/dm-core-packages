import { useFormContext } from 'react-hook-form'
import { ErrorResponse, useDMSS } from '@development-framework/dm-core'
import { useRegistryContext } from '../context/RegistryContext'
import { AxiosError, AxiosResponse } from 'axios'
import TooltipButton from '../../common/TooltipButton'
import { add } from '@equinor/eds-icons'
import React from 'react'

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
    <TooltipButton
      title="Add and save"
      button-variant="ghost_icon"
      button-onClick={handleAdd}
      icon={add}
    />
  )
}

export default AddObject
