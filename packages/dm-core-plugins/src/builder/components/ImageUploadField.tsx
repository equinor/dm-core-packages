import {
  EBlueprint,
  type TFileEntity,
  useApplication,
} from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import { type ChangeEvent, useRef, useState } from 'react'
import * as Styled from '../styles'
import * as S from './ImageUploadField.styles'

type TImageUploadFieldProps = {
  label: string
  /** Current image address (absolute DMSS File address) or empty. */
  value: string
  dataSource: string
  onChange: (address: string | undefined) => void
}

/**
 * Lets the user pick an image from their computer. The blob is uploaded to the
 * data source and a File entity is created so the media viewer can render it.
 * The widget stores only the resulting File address, so it works for any number
 * of images without needing a matching page attribute.
 */
export const ImageUploadField = ({
  label,
  value,
  dataSource,
  onChange,
}: TImageUploadFieldProps): React.ReactElement => {
  const input = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const { dmssAPI } = useApplication()

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError(undefined)
    setLoading(true)
    try {
      const blobId = crypto.randomUUID()
      await dmssAPI.blobUpload({ dataSourceId: dataSource, file, blobId })
      const ext = file.name.split('.').slice(1).pop()?.toLowerCase() ?? ''
      const entity: TFileEntity = {
        type: EBlueprint.FILE,
        name: file.name.split('.').slice(0, -1).join('.') || file.name,
        author: '',
        date: new Date().toDateString(),
        size: file.size,
        filetype: ext,
        content: {
          type: 'dmss://system/SIMOS/Reference',
          referenceType: 'storage',
          address: `$${blobId}`,
        },
      }
      const res = await dmssAPI.documentAddSimple({
        dataSourceId: dataSource,
        body: entity,
      })
      onChange(`dmss://${dataSource}/$${res.data}`)
    } catch {
      setError('Could not upload image')
    } finally {
      setLoading(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <>
      <Styled.FieldLabel>{label}</Styled.FieldLabel>
      <S.HiddenInput
        ref={input}
        type='file'
        accept='image/*'
        onChange={handleFile}
      />
      <Button
        variant='outlined'
        disabled={loading}
        onClick={() => input.current?.click()}
      >
        {loading ? (
          <Progress.Dots />
        ) : value ? (
          'Replace image…'
        ) : (
          'Browse computer…'
        )}
      </Button>
      {value && (
        <S.RemoveButton variant='ghost' onClick={() => onChange(undefined)}>
          Remove image
        </S.RemoveButton>
      )}
      {error && <S.ErrorHelp>{error}</S.ErrorHelp>}
    </>
  )
}
