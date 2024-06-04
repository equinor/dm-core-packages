import { BlueprintPicker } from '@development-framework/dm-core'
import { TextField, Typography } from '@equinor/eds-core-react'
import { DeleteSoftButton, Stack } from '../common'

export const Extends = (props: {
  formData: string[]
  setExtends: (data: any) => void
}) => {
  const { formData, setExtends } = props
  return (
    <Stack>
      <Stack direction='row' alignItems='center' spacing={0.5}>
        <Typography bold={true}>Extends</Typography>
        <BlueprintPicker
          onChange={(newBlueprint: string) =>
            setExtends([...formData, newBlueprint])
          }
          label='Add blueprints to extend from'
        />
      </Stack>
      <ul>
        {formData.length > 0 &&
          formData.map((typeRef: string) => (
            <Stack key={typeRef} as='li' direction='row' spacing={0.5}>
              <TextField id={typeRef} readOnly={true} value={typeRef} />
              <DeleteSoftButton
                title='Remove blueprint'
                onClick={() =>
                  setExtends(
                    formData.filter(
                      (typeToRemove: string) => typeToRemove !== typeRef
                    )
                  )
                }
              />
            </Stack>
          ))}
      </ul>
    </Stack>
  )
}
