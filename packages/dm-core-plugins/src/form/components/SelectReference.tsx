import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  EBlueprint,
  EntityPickerDialog,
  ErrorResponse,
  TLinkReference,
  useDMSS,
} from '@development-framework/dm-core'
import { useRegistryContext } from '../context/RegistryContext'
import { AxiosError } from 'axios/index'
import TooltipButton from '../../common/TooltipButton'
import { add, edit } from '@equinor/eds-icons'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'

export const SelectReference = (props: {
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
      <Tooltip title={`${value ? 'Edit' : 'Add'} and save`}>
        {/* <Button onClick={() => setShowModal(true)} variant="ghost" as="button">
          <div className="flex space-x-1 align-middle">
            <Icon color="#007079" data={edit}></Icon>
            <Typography className="self-center">Select</Typography>
          </div>
        </Button> */}
        <button
          onClick={() => setShowModal(true)}
          type='button'
          className='bg-transparent hover:bg-[#DEEDEE] py-1 px-2 rounded-full'
        >
          <div className='flex space-x-1 align-middle'>
            <Icon color='#007079' data={edit}></Icon>
            <Typography className='self-center'>Select</Typography>
          </div>
        </button>
      </Tooltip>
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
