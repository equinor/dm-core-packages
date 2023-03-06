export function prettifyName(uglyName: string): string {
  if (!uglyName) return ''
  const newName = uglyName.replace(/[-_]/g, ' ')
  return newName[0].toUpperCase() + newName.slice(1)
}
