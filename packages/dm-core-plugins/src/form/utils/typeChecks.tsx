export const isPrimitiveType = (value: string): boolean => {
  return ['string', 'number', 'integer', 'boolean'].includes(value)
}

export const isArray = (dimensions: string) => {
  return dimensions && dimensions !== ''
}

export const isMultiDimensional = (dimensions: string) => {
  return dimensions && dimensions.includes(',')
}

export const isPrimitive = (attributeType: string): boolean => {
  return ['string', 'number', 'integer', 'boolean'].includes(
    attributeType as string
  )
}

export const getFieldType = (attribute: any) => {
  const { attributeType, dimensions } = attribute

  if (attributeType === 'binary') {
    return 'binary'
  }

  if (!isArray(dimensions) && isPrimitive(attributeType)) {
    return attributeType
  }

  if (isArray(dimensions)) {
    return 'array'
  } else {
    return 'object'
  }
}
