/**
 * An utility function to find dataSourceId from an address
 *
 * @param address an address on the format: PROTOCOL://DATA SOURCE/<path> or DATA SOURCE/<path> or /DATA SOURCE/<path>
 */
export function getDataSourceIdFromAddress(address: string): string {
  if (address.includes('://')) {
    return address.split('/', 3)[2]
  } else if (address[0] === '/') {
    return address.split('/', 2)[1]
  } else {
    return address.split('/', 2)[0]
  }
}
