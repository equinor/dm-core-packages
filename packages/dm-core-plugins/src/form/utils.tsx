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
