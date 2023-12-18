import { splitString } from './stringUtilities'

/**
 * Splits an address into its respective parts
 *
 * @param address An absolute address. Valid formats include (both DOCUMENT_PATH and ATTRIBUTE_PATH is optional):
 *  PROTOCOL://DATA_SOURCE/DOCUMENT_PATH.ATTRIBUTE_PATH
 *  /DATA_SOURCE/DOCUMENT_PATH.ATTRIBUTE_PATH
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
 * @param address A relative address. Valid formats include (ATTRIBUTE_PATH is optional):
 * PROTOCOL://DATA_SOURCE/DOCUMENT_PATH.ATTRIBUTE_PATH
 * /DOCUMENT_PATH.ATTRIBUTE_PATH
 * DOCUMENT_PATH.ATTRIBUTE_PATH
 * ^.ATTRIBUTE_PATH
 * @param fallbackDocumentPath
 * @param dataSource
 * @returns
 */
export const resolveRelativeAddress = (
  address: string,
  fallbackDocumentPath: string,
  dataSource: string,
  relative_path?: string[]
) => {
  address = address.replace(/^[/. ]+|[/. ]+$/g, '')
  if (address.includes('://')) return address
  const [documentPath, attributePath] = address.includes('.')
    ? splitString(address, '.', 1)
    : [address, '']

  if (documentPath === '~') {
    if (!relative_path)
      throw 'Missing relative path to be able to resolve the address'
    let go_up = address.split('~').length - 1
    const path = Array.from(relative_path)
    while (go_up !== 0) {
      path.pop()
      go_up -= 1
    }
    const rest = address.split('~', -1).slice(-1)
    if (path.length > 0)
      return `/${dataSource}/${fallbackDocumentPath}.${path.join('.')}${rest}`
    else return `/${dataSource}/${fallbackDocumentPath}${rest}`
  }

  return `/${dataSource}/${
    documentPath === '^' ? fallbackDocumentPath : documentPath
  }${attributePath ? '.' + attributePath : ''}`
}
