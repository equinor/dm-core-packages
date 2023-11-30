export const isPrimitiveType = (value: string): boolean => {
	return ['string', 'number', 'integer', 'boolean'].includes(value)
}
