import { truncatePathString } from '@development-framework/dm-core'
import { Accordion, Button, Icon, Typography } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import styled from 'styled-components'
import { DeleteSoftButton, Stack } from '../common'
import { BlueprintAttribute } from './BlueprintAttribute'

interface BlueprintAttributeListProps {
  formData: any

  setFormData: (data: object) => void
}

const AttributeWrapper = styled.div`
  width: 25%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const BlueprintAttributeList = ({
  formData,
  setFormData,
}: BlueprintAttributeListProps) => {
  return (
    <>
      <Stack direction='row' spacing={0.5} alignItems='center'>
        <Typography bold={true}>Attributes</Typography>
        <Button
          as='button'
          variant='ghost_icon'
          onClick={() =>
            setFormData({
              ...formData,
              attributes: [
                ...formData.attributes,
                {
                  name: 'new-attribute',
                  attributeType: 'string',
                  type: 'dmss://system/SIMOS/BlueprintAttribute',
                  contained: true,
                  optional: true,
                  _id: crypto.randomUUID(),
                },
              ],
            })
          }
        >
          <Icon data={add}></Icon>
        </Button>
      </Stack>
      <Stack padding={0.5}>
        <Accordion>
          {Array.isArray(formData?.attributes) &&
            formData.attributes.map((attribute: any, index: number) => (
              <Accordion.Item key={attribute._id || attribute.name}>
                <Accordion.Header>
                  <Stack
                    spacing={0.5}
                    direction='row'
                    fullWidth
                    alignItems='center'
                  >
                    <AttributeWrapper style={{ fontWeight: 'bold' }}>
                      {attribute.name}
                    </AttributeWrapper>
                    <AttributeWrapper>
                      {truncatePathString(attribute.attributeType)}{' '}
                    </AttributeWrapper>{' '}
                    <AttributeWrapper>
                      {attribute?.contained === undefined ||
                      attribute?.contained === true
                        ? 'Contained'
                        : 'Uncontained'}
                    </AttributeWrapper>
                    <AttributeWrapper>
                      Dim: {attribute?.dimensions || ' - '}
                    </AttributeWrapper>
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
                  </Stack>
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
      </Stack>
    </>
  )
}
