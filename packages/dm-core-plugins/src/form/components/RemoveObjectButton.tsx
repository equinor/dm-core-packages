import {
  DeleteHardButton,
  ErrorResponse,
  useApplication,
} from '@development-framework/dm-core'
import { AxiosError } from 'axios'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'

const RemoveObject = (props: {
  namePath: string
  address?: string
  popupTitle?: string
  buttonTitle?: string
  popupMessage?: string
  onRemove?: () => void
}) => {
  const { buttonTitle, popupTitle, popupMessage, namePath, address, onRemove } =
    props
  const { unregister } = useFormContext()
  const { idReference } = useRegistryContext()
  const { dmssAPI } = useApplication()

  const onClick = () => {
    dmssAPI
      .documentRemove({
        address: address ? address : `${idReference}.${namePath}`,
      })
      .then(() => {
        unregister(namePath)
        if (onRemove) onRemove()
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }
  return (
    <DeleteHardButton
      onConfirmDelete={onClick}
      title={buttonTitle || `Delete ${namePath}`}
      popupTitle={popupTitle}
      popupMessage={popupMessage}
    />
  )
}

export default RemoveObject
