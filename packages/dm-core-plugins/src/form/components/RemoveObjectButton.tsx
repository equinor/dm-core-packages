import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import { ErrorResponse, useDMSS } from '@development-framework/dm-core'
import { AxiosError } from 'axios'
import TooltipButton from '../../common/TooltipButton'
import { delete_forever } from '@equinor/eds-icons'
import React from 'react'

const RemoveObject = (props: {
  namePath: string
  address?: string
  onRemove?: () => void
}) => {
  const { namePath, address, onRemove } = props
  const { unregister } = useFormContext()
  const { idReference } = useRegistryContext()
  const dmssAPI = useDMSS()

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
    <TooltipButton
      title='Remove and save'
      button-variant='ghost_icon'
      button-onClick={onClick}
      icon={delete_forever}
    />
  )
}

export default RemoveObject
