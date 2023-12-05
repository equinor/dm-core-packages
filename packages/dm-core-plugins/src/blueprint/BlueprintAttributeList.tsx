import { Accordion } from '@equinor/eds-core-react'
import { truncatePathString } from '@development-framework/dm-core'
import { BlueprintAttribute } from './BlueprintAttribute'
import { Fieldset } from '../form/styles'
import * as React from 'react'
import { DeleteSoftButton } from './DeleteSoftButton'

interface BlueprintAttributeListProps {
  formData: any

  setFormData: (data: object) => void
}

export const BlueprintAttributeList = ({
  formData,
  setFormData,
}: BlueprintAttributeListProps) => {
  return (
    <Fieldset className={'m-2 w-full'}>
      <Accordion>
        {Array.isArray(formData?.attributes) &&
          formData.attributes.map((attribute: any, index: number) => (
            <Accordion.Item key={attribute._id} className={'ms-5'}>
              <Accordion.Header>
                <div className={'flex space-x-2 justify-between w-full'}>
                  <div
                    className={
                      'w-1/4 self-center whitespace-nowrap overflow-hidden font-bold overflow-ellipsis'
                    }
                  >
                    {attribute.name}
                  </div>
                  <div
                    className={
                      'w-1/4 self-center whitespace-nowrap overflow-ellipsis overflow-hidden'
                    }
                  >
                    {truncatePathString(attribute.attributeType)}{' '}
                  </div>{' '}
                  <div
                    className={
                      'w-1/4 self-center whitespace-nowrap overflow-ellipsis overflow-hidden'
                    }
                  >
                    {attribute?.contained === undefined ||
                    attribute?.contained === true
                      ? 'Contained'
                      : 'Uncontained'}
                  </div>
                  <div
                    className={
                      'w-1/4 self-center whitespace-nowrap overflow-ellipsis overflow-hidden'
                    }
                  >
                    Dim: {attribute?.dimensions || ' - '}
                  </div>
                  <DeleteSoftButton
                    onClick={(event) => {
                      formData.attributes.splice(index, 1)
                      setFormData({
                        ...formData,
                        attributes: [...formData.attributes],
                      })
                      event.stopPropagation() // Stop the Accordion header from registering the click event
                    }}
                    title='Remove attribute'
                  />
                </div>
              </Accordion.Header>
              <Accordion.Panel>
                <BlueprintAttribute
                  attribute={attribute}
                  setAttribute={(changedAttribute: any) => {
                    const newAttributes = [...formData.attributes]
                    newAttributes[index] = changedAttribute
                    setFormData({ ...formData, attributes: newAttributes })
                  }}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
    </Fieldset>
  )
}
