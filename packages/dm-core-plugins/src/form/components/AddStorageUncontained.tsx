import { splitAddress, useApplication } from '@development-framework/dm-core'
import { AxiosResponse } from 'axios'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import GhostTextButton from './GhostTextButton'

const createStorageReference = (address: string) => {
  return {
    type: 'dmss://system/SIMOS/Reference',
    address: address,
    referenceType: 'storage',
  }
}
const AddStorageUncontained = (props: {
  type: string
  namePath: string
}) => {
  const { type, namePath } = props
  const { idReference } = useRegistryContext()
  const { setValue } = useFormContext()

  const { dmssAPI } = useApplication()
  const addDocument = () => {
    const options = {
      shouldDirty: true,
    }
    const { dataSource } = splitAddress(idReference)
    dmssAPI
      .instantiateEntity({
        entity: { type: type as string },
      })
      .then((newEntity: AxiosResponse<any>) => {
        dmssAPI
          .documentAdd({
            address: `${dataSource}/plugins`,
            document: JSON.stringify(newEntity.data),
          })
          .then((response: AxiosResponse<any>) => {
            setValue(
              namePath,
              createStorageReference(`$${response.data.uid}`),
              options
            )
          })
      })
  }
  return (
    <GhostTextButton
      onClick={addDocument}
      buttonText={'Create'}
      title={'Create'}
      tooltip={`Create new ${namePath}`}
      ariaLabel={'Create new entity'}
    />
  )
}

export default AddStorageUncontained
