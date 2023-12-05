/**
 * Split an array like you would in python
 * @param target The string you want to split
 * @param separator Delimiter at which splits occur
 * @param maxsplit Maximum number of splits
 * @returns An array of max length maxsplit + 1
 */
export const splitString = (
  target: string,
  separator: string,
  maxsplit: number
) => {
  const arr = target.split(separator)
  if (arr.slice(maxsplit).length === 0) return arr
  return [...arr.slice(0, maxsplit), arr.slice(maxsplit).join(separator)]
}

export function formatBytes(bytes: any, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
