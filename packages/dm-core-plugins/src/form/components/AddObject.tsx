import {
  type ErrorResponse,
  useApplication,
} from '@development-framework/dm-core'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import GhostTextButton from './GhostTextButton'

export const AddObject = (props: {
  type: string
  namePath: string
  defaultValue?: any
  onAdd?: () => void
}) => {
  const queryClient = useQueryClient()
  const { type, namePath, defaultValue, onAdd } = props
  const { setValue } = useFormContext()
  const { dmssAPI } = useApplication()
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
    dmssAPI
      .documentAdd({
        address: `${idReference}.${namePath}`,
        document: JSON.stringify(document),
      })
      .then(() => {
        const options = {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        }
        setValue(namePath, document, options)
        queryClient.invalidateQueries({
          queryKey: ['attributes', `${idReference}.${namePath}`],
          exact: false,
        })
        onAdd?.()
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }
  return (
    <GhostTextButton
      onClick={handleAdd}
      buttonText={'Create'}
      title={'Create'}
      tooltip={`Create new ${namePath}`}
      ariaLabel={'Create new entity'}
    />
  )
}
