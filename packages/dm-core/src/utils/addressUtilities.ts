import { splitString } from './stringUtilities'

/**
 * Splits an address into its respective parts
 *
 * @param address An absolute address. Valid formats include (both DOCUMENT_PATH and ATTRIBUTE_PATH is optional):
 *  PROTOCOL://DATA_SOURCE/DOCUMENT_PATH.ATTRIBUTE_PATH
 *  DATA_SOURCE/DOCUMENT_PATH.ATTRIBUTE_PATH
 */
export const splitAddress = (address: string) => {
  const protocol = address.includes('://') ? address.split('://', 1)[0] : ''
  const addressWithoutProtocol = address.includes('://')
    ? address.split('://', 2)[1]
    : address.replace(/^[/. ]+|[/. ]+$/g, '')
  const [dataSource, path] = addressWithoutProtocol.includes('/')
    ? splitString(addressWithoutProtocol, '/', 1)
    : [addressWithoutProtocol, '']
  const [documentPath, attributePath] = path.includes('.')
    ? splitString(path, '.', 1)
    : [path, '']
  return { protocol, dataSource, documentPath, attributePath }
}

/**
 *
 * @param relativeAddress A relative address. Valid formats include (ATTRIBUTE_PATH is optional):
 * PROTOCOL://DATA_SOURCE/DOCUMENT_PATH.ATTRIBUTE_PATH
 * DOCUMENT_PATH.ATTRIBUTE_PATH
 * ^.ATTRIBUTE_PATH
 * @param knownPrefix
 * @param dataSource
 * @returns
 */
export const resolveRelativeAddress = (
  relativeAddress: string,
  knownPrefix: string,
  dataSource: string,
  relative_path?: string[]
) => {
  relativeAddress = relativeAddress.replace(/^[/. ]+|[/. ]+$/g, '')
  if (relativeAddress.includes('://')) return relativeAddress
  const [documentPath, attributePath] = relativeAddress.includes('.')
    ? splitString(relativeAddress, '.', 1)
    : [relativeAddress, '']

  if (documentPath === '~') {
    if (!relative_path)
      throw 'Missing relative path to be able to resolve the address'
    let go_up = relativeAddress.split('~').length - 1
    const path = Array.from(relative_path)
    while (go_up !== 0) {
      path.pop()
      go_up -= 1
    }
    const rest = relativeAddress.split('~', -1).slice(-1)
    if (path.length > 0)
      return `/${dataSource}/${knownPrefix}.${path.join('.')}${rest}`
    else return `/${dataSource}/${knownPrefix}${rest}`
  }

  return `/${dataSource}/${documentPath === '^' ? knownPrefix : documentPath}${
    attributePath ? '.' + attributePath : ''
  }`
}

/**
 *
 * Aim's to have a simpler to use interface than resolveRelativeAddress
 *
 * @param relativeAddress An address, possibly relative .
 * Valid formats include (ATTRIBUTE_PATH is optional):
 * PROTOCOL://DATA_SOURCE/DOCUMENT_PATH.ATTRIBUTE_PATH
 * $2.ATTRIBUTE_PATH
 * ~.~.ATTRIBUTE_PATH
 * ^.ATTRIBUTE_PATH
 * @param location Where the relative address is being encountered. Must be an absolute address.
 * @returns absoluteAddress
 */
export const resolveRelativeAddressSimplified = (
  relativeAddress: string,
  location: string
): string => {
  if (!relativeAddress)
    throw new Error('Cannot resolve an empty address. Check your recipe.')

  if (relativeAddress.includes('://')) return relativeAddress // It's absolute

  const { dataSource, documentPath, attributePath, protocol } =
    splitAddress(location)

  if (relativeAddress[0] === '~') {
    let go_up = relativeAddress.split('~').length - 1

    // Split a string like "$23.car[5].b" into ["$23", "car", "[5]", "b"]
    const regex = /((\$[\w\-]+|[\w\-]+|\[\d+\]))/g
    const pathElements = `${documentPath}.${attributePath}`.match(
      regex
    ) as string[]
    while (go_up !== 0) {
      pathElements.pop()
      go_up -= 1
    }
    const rest = relativeAddress.split('~', -1).slice(-1)
    if (!pathElements.length)
      throw 'Invalid relative reference. Cannot traverse out of uncontained parent'

    return `${protocol}://${dataSource}/${pathElements.join('.')}${rest}`
  }
  if (relativeAddress[0] === '$') {
    return `${protocol}://${dataSource}/${relativeAddress}`
  }
  if (relativeAddress[0] === '/') {
    return `${protocol}://${dataSource}${relativeAddress}`
  }
  if (['.', 'self'].includes(relativeAddress)) {
    return location
  }
  if (relativeAddress[0] === '.') {
    return `${location}${relativeAddress}`
  }
  if (relativeAddress[0] === '^') {
    const attributes = relativeAddress.slice(1)
    return `${protocol}://${dataSource}/${documentPath}${attributes}`
  }
  throw new Error(
    `Invalid format for relative address '${relativeAddress}' at location '${location}'. Check format and update recipes.`
  )
}
