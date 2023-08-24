import { Button, Progress } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useDMSS } from '../context/DMSSContext'
import { TGenericObject, TReference, TValidEntity } from '../types'
import { getKey } from '../utils/objectUtilities'

// fileSuffix - A list of strings with allowed file suffixes without '.'. For example to allow yaml uploads; ['yaml', 'yml']
// getBody - A callback function to get the body of the document where file (Blob) should be created in.
// onUpload - Function to call when the document has been created on the server. Sends the new document's reference as an argument
// formData - only used to clear 'error' state when the parent form using this component changes
export function UploadFileButton(props: {
  fileSuffix: string[]
  getBody: (filename: string) => TValidEntity
  dataSourceId: string
  onUpload: (createdRef: TReference) => void
  formData?: TReference
}) {
  const { fileSuffix, getBody, dataSourceId, onUpload, formData } = props
  const textInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  useEffect(() => setError(undefined), [formData])

  function handleUploadSTaskFile(event: any): void {
    setError('')
    const file = event.target.files[0]
    const suffix = file.name.split('.')[file.name.split('.').length - 1]
    if (!fileSuffix.includes(suffix)) {
      toast.error(`Only files of type '${fileSuffix}' can be uploaded here`)
    } else {
      const newDocumentBody = getBody(file.name)
      setLoading(true)
      dmssAPI
        .documentAdd({
          address: `${dataSourceId}/Data/STasks`,
          document: JSON.stringify(newDocumentBody),
          updateUncontained: true,
        })
        .then((response: AxiosResponse<TGenericObject>) =>
          onUpload({
            _id: response.data.uid,
            name: getKey<string>(newDocumentBody, 'name', 'string'),
            type: newDocumentBody.type,
          })
        )
        .catch((error: AxiosError<any>) => {
          const errorResponse =
            typeof error.response?.data == 'object'
              ? error.response?.data?.message
              : error.response?.data
          const errorMessage = errorResponse || 'Failed to upload file'
          setError(errorMessage)
        })
        .finally(() => setLoading(false))
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      {/* We want to upload files via a custom button instead of the default html <input> element.
        Therefore, we create a ref for the <input> and make clicks on the <Button>
        triggers clicks on that hidden <input> element.
      */}
      <input
        type="file"
        ref={textInput}
        accept={fileSuffix.map((a: string) => '.' + a).join(',')}
        style={{ display: 'none' }}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleUploadSTaskFile(event)
        }
      />
      {loading ? (
        <Button style={{ margin: '0 10px' }}>
          <Progress.Dots />
        </Button>
      ) : (
        <Button
          onClick={() => textInput?.current?.click()}
          style={{ margin: '0 10px' }}
        >
          Upload
        </Button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
