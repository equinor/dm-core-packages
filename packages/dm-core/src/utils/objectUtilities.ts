export function getKey<T>(
  object: { [k: string]: any } | undefined,
  key: string,
  type: string
): T | undefined {
  return object !== undefined && key in object && typeof object[key] === type
    ? object[key]
    : undefined
}
