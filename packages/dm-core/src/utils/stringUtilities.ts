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
  if (arr.slice(maxsplit).length == 0) return arr
  return [...arr.slice(0, maxsplit), arr.slice(maxsplit).join(separator)]
}
