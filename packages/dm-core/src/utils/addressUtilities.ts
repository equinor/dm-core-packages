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
) => {
  address = address.replace(/^[/. ]+|[/. ]+$/g, '')
  if (address.includes('://')) return address
  const [documentPath, attributePath] = address.includes('.')
    ? splitString(address, '.', 1)
    : [address, '']
  return `/${dataSource}/${
    documentPath == '^' ? fallbackDocumentPath : documentPath
  }${attributePath ? '.' + attributePath : ''}`
}
