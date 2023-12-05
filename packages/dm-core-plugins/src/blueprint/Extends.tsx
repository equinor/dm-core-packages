import {
  Button,
  Icon,
  Label,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import { BlueprintPicker } from '@development-framework/dm-core'
import { Fieldset } from '../form/styles'
import { close } from '@equinor/eds-icons'
import * as React from 'react'

export const Extends = (props: {
  formData: string[]
  setExtends: (data: any) => void
}) => {
  const { formData, setExtends } = props
  return (
    <>
      <div className={'flex justify-start'}>
        <Typography className={'self-center'} bold={true}>
          Extends
        </Typography>
        <div style={{ display: 'flex' }}>
          <BlueprintPicker
            onChange={(newBlueprint: string) =>
              setExtends([...formData, newBlueprint])
            }
            fieldType={'button'}
            label={'Add extends'}
          />
        </div>
      </div>
      <ul>
        <Fieldset className={'ms-2'}>
          {formData.length > 0 && (
            <div>
              {formData.map((typeRef: string, index: number) => (
                <li key={index}>
                  <div className={'flex align-middle justify-between ms-5'}>
                    <TextField readOnly={true} value={typeRef} id={'123'} />
                    <Button
                      variant='ghost_icon'
                      onClick={() =>
                        setExtends(
                          formData.filter(
                            (typeToRemove: string) => typeToRemove !== typeRef
                          )
                        )
                      }
                    >
                      <Icon data={close} size={18} title='remove extend item' />
                    </Button>
                  </div>
                </li>
              ))}
            </div>
          )}
        </Fieldset>
      </ul>
    </>
  )
}
