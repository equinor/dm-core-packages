import {
  ErrorResponse,
  TGenericObject,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Label } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import { TStringFieldProps } from '../types'

const getTarget = (initialValue: any) => {
  const { idReference } = useRegistryContext()
  if (initialValue['address'].includes('blob')) {
    const address = initialValue['address'].replace('blob://', '')
    return address.split('/', 2)
  } else {
    return [idReference?.split('/', 2)[0], initialValue['address']]
  }
}

const DownloadBinary = (props: {
  fileId: string
  namePath: string
  displayLabel: string
  initialValue: TGenericObject & { address: string }
}) => {
  const { namePath, displayLabel, initialValue } = props
  const dmssAPI = useDMSS()
  const [data_source_id, blob_id] = getTarget(initialValue)

  const handleDownload = () => {
    dmssAPI
      .blobGetById({
        dataSourceId: data_source_id,
        blobId: blob_id,
      })
      .then((response: AxiosResponse) => {
        const data = response.data
        const blob = new Blob([data], { type: 'application/pdf' })
        const fileURL = window.URL.createObjectURL(blob)
        // Setting various property values
        const alink = document.createElement('a')
        alink.href = fileURL
        alink.download = 'SamplePDF.pdf'
        alink.click()
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }

  return (
    <div>
      <Label label={displayLabel} />
      <Button
        namePath={namePath}
        label={displayLabel}
        onClick={() => handleDownload()}
      >
        Open
      </Button>
    </div>
  )
}

export const BinaryField = (props: TStringFieldProps) => {
  const { namePath } = props
  const { getValues } = useFormContext()

  const fileId = getValues(namePath.split('.').slice(-1).join('.'))
  const initialValue = getValues(namePath)

  return (
    <>
      {initialValue?.address != undefined && (
        <DownloadBinary
          {...props}
          fileId={fileId}
          initialValue={initialValue}
        />
      )}
    </>
  )
}
