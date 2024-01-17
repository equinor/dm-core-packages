import { ErrorResponse, useDMSS } from '@development-framework/dm-core'
import { AxiosError, AxiosResponse } from 'axios'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import GhostTextButton from './GhostTextButton'

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
    <GhostTextButton
      onClick={handleAdd}
      buttonText={'Create'}
      title={'Create'}
      tooltip={`Create new ${namePath}`}
      ariaLabel={'Create new entity'}
    />
  )
}

export default AddObject
