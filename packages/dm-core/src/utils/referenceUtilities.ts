/**
 * An utility function to find dataSourceId from a reference
 *
 * @param reference a reference on the format: PROTOCOL://DATA SOURCE/<path>  DATA SOURCE/<path>
 */
export function getDataSourceIdFromReference(reference: string): string {
  if (reference.includes('://')) {
    return reference.split('/', 3)[2]
  } else {
    return reference.split('/', 2)[0]
  }
}
