import { resolveRelativeAddress, splitAddress } from './addressUtilities'

test('split dmss://test_source/complex/myCarRental.cars[0].engine', async () => {
  const { protocol, dataSource, documentPath, attributePath } = splitAddress(
    'dmss://test_source/complex/myCarRental.cars[0].engine',
  )
  expect(protocol).toBe('dmss')
  expect(dataSource).toBe('test_source')
  expect(documentPath).toBe('complex/myCarRental')
  expect(attributePath).toBe('cars[0].engine')
})

test('split dmss://test_source/$1.cars[0]', async () => {
  const { protocol, dataSource, documentPath, attributePath } = splitAddress(
    'dmss://test_source/$1.cars[0]',
  )
  expect(protocol).toBe('dmss')
  expect(dataSource).toBe('test_source')
  expect(documentPath).toBe('$1')
  expect(attributePath).toBe('cars[0]')
})

test('split dmss://test_source/$1', async () => {
  const { protocol, dataSource, documentPath, attributePath } = splitAddress(
    'dmss://test_source/$1',
  )
  expect(protocol).toBe('dmss')
  expect(dataSource).toBe('test_source')
  expect(documentPath).toBe('$1')
  expect(attributePath).toBe('')
})

test('split dmss://test_source', async () => {
  const { protocol, dataSource, documentPath, attributePath } =
    splitAddress('dmss://test_source')
  expect(protocol).toBe('dmss')
  expect(dataSource).toBe('test_source')
  expect(documentPath).toBe('')
  expect(attributePath).toBe('')
})

test('split /test_source/$1', async () => {
  const { protocol, dataSource, documentPath, attributePath } =
    splitAddress('/test_source/$1')
  expect(protocol).toBe('')
  expect(dataSource).toBe('test_source')
  expect(documentPath).toBe('$1')
  expect(attributePath).toBe('')
})

test('split test_source/$1', async () => {
  const { protocol, dataSource, documentPath, attributePath } =
    splitAddress('test_source/$1')
  expect(protocol).toBe('')
  expect(dataSource).toBe('test_source')
  expect(documentPath).toBe('$1')
  expect(attributePath).toBe('')
})

test('resolve address with ^', () => {
  const resolved = resolveRelativeAddress('^.cars[0]', '$1', 'test_source')
  expect(resolved).toBe('/test_source/$1.cars[0]')
})

test('resolve address with multiple attributes', () => {
  const resolved = resolveRelativeAddress(
    '$2.cars[0].engine',
    '$1',
    'test_source',
  )
  expect(resolved).toBe('/test_source/$2.cars[0].engine')
})

test('resolve address with no attributes', () => {
  const resolved = resolveRelativeAddress('$2', '$1', 'test_source')
  expect(resolved).toBe('/test_source/$2')
})

test('resolve address with id', () => {
  const resolved = resolveRelativeAddress('$2.cars[0]', '$1', 'test_source')
  expect(resolved).toBe('/test_source/$2.cars[0]')
})

test('resolve address with slash and id', () => {
  const resolved = resolveRelativeAddress('/$2.cars[0]', '$1', 'test_source')
  expect(resolved).toBe('/test_source/$2.cars[0]')
})

test('resolve address with query', () => {
  const resolved = resolveRelativeAddress(
    '/[(_id=1)].content[(name=myCarRental)].cars[0]',
    '$1',
    'test_source',
  )
  expect(resolved).toBe(
    '/test_source/[(_id=1)].content[(name=myCarRental)].cars[0]',
  )
})

test('resolve address with package path', () => {
  const resolved = resolveRelativeAddress(
    'complex/myCarRental.cars[0]',
    '$1',
    'test_source',
  )
  expect(resolved).toBe('/test_source/complex/myCarRental.cars[0]')
})

test('resolve address with data source', () => {
  const resolved = resolveRelativeAddress(
    'dmss://other_source/$2.cars[0]',
    '$1',
    'test_source',
  )
  expect(resolved).toBe('dmss://other_source/$2.cars[0]')
})
