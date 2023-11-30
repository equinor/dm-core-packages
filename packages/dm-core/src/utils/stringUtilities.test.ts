import { splitString } from './stringUtilities'

test('too many hits', () => {
	const result = splitString('a_b_c_d', '_', 1)
	expect(result).toEqual(['a', 'b_c_d'])
})

test('exact number of hits', () => {
	const result = splitString('a_b', '_', 1)
	expect(result).toEqual(['a', 'b'])
})

test('missing string after split', () => {
	const result = splitString('a_', '_', 1)
	expect(result).toEqual(['a', ''])
})

test('too few hits', () => {
	const result = splitString('', '_', 1)
	expect(result).toEqual([''])
})
