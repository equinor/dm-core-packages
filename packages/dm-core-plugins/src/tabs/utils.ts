export function prettifyName(uglyName: string): string {
  if (!uglyName) return ''
  let newName = uglyName.replace(/[-_]/g, ' ')
  return newName[0].toUpperCase() + newName.slice(1)
}
