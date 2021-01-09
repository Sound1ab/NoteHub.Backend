import { allowHeaders } from './allowHeaders'

export function lowerCaseObjectProps(object: Record<string, string>) {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (allowHeaders.includes(key.toLowerCase())) {
      acc[key.toLowerCase()] = value
    }
    return acc
  }, {} as Record<string, string>)
}
