export function getQueryString(
  queryStringParameters: { [name: string]: string } | null
) {
  return queryStringParameters
    ? Object.entries(queryStringParameters).reduce((acc, [prop, value]) => {
        acc = `${prop}=${value}`
        return acc
      }, '')
    : null
}
