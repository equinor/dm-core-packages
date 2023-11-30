function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
	const arrayCopy = [...arr]
	const element = arrayCopy[fromIndex]
	arrayCopy.splice(fromIndex, 1)
	arrayCopy.splice(toIndex, 0, element)
	return arrayCopy
}

export function moveItem(list: any[], key: string, direction: 'up' | 'down') {
	const itemIndex = list.findIndex((item) => item.key === key)
	const toIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1
	const updatedList = arrayMove(list, itemIndex, toIndex)
	return updatedList
}
