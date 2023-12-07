import { TAttribute, TBlueprint } from '@development-framework/dm-core'
import React from 'react'
import { AttributeField } from '../fields/AttributeField'
import { useRegistryContext } from '../context/RegistryContext'

export const AttributeList = (props: {
  namePath: string
  blueprint: TBlueprint
}) => {
  const { namePath, blueprint } = props
  const prefix = namePath === '' ? `` : `${namePath}.`
  const { config } = useRegistryContext()
  const attributes: TAttribute[] | undefined = blueprint.attributes

  let filteredAttributes =
    config && config.fields.length
      ? config.fields
          .map((name: string) =>
            attributes?.find((attribute: TAttribute) => attribute.name === name)
          )
          .filter((attribute): attribute is TAttribute => !!attribute)
      : attributes

  const hideByDefaultFields: string[] = ['type', '_meta_']
  if (!(config && config.fields.length)) {
    filteredAttributes = filteredAttributes?.filter(
      (attribute) => !hideByDefaultFields.includes(attribute.name)
    )
  }
  return (
    <>
      {filteredAttributes?.map((attribute: TAttribute) => {
        const uiAttribute = config?.attributes.find(
          (uiAttribute) => uiAttribute.name === attribute.name
        )
        return (
          <div
            data-testid={`${prefix}${attribute.name}`}
            key={`${prefix}${attribute.name}`}
            className='pb-3'
          >
            <AttributeField
              namePath={`${prefix}${attribute.name}`}
              attribute={attribute}
              uiAttribute={uiAttribute}
            />
          </div>
        )
      })}
    </>
  )
}
