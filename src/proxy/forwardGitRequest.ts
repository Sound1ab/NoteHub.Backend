import { APIGatewayProxyEvent } from 'aws-lambda'
import { allow } from './allow'
import fetch from 'node-fetch'
import { filterResponseHeaders } from './filterResponseHeaders'
import { getQueryString } from './getQueryString'
import { replaceAuthorizationHeader } from './replaceAuthorizationHeader'

export async function forwardGitRequest(event: APIGatewayProxyEvent) {
  allow(event)

  const {
    httpMethod,
    pathParameters,
    queryStringParameters,
    body: requestBody,
    headers,
  } = event

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
    }
  }

  const pathdomain = pathParameters?.proxy

  if (!pathdomain) throw new Error('Proxy: pathdomain missing')

  const requestHeaders: Record<string, string> = replaceAuthorizationHeader(
    headers
  )

  // GitHub uses user-agent sniffing for git/* and changes its behavior which is frustrating
  if (
    !requestHeaders['user-agent'] ||
    !requestHeaders['user-agent'].startsWith('git/')
  ) {
    requestHeaders['user-agent'] = 'git/@isomorphic-git/cors-proxy'
  }

  requestHeaders.TE = 'Trailer'

  const queryString = getQueryString(queryStringParameters)

  const base = `https://${pathdomain}`

  const url = queryString ? `${base}?${queryString}` : base

  const response = await fetch(url, {
    body: requestBody ? requestBody : undefined,
    headers: requestHeaders,
    method: httpMethod,
  })

  if (response.status === 401) throw new Error('No anonymous write access')

  if (response.status !== 200 || response.statusText !== 'OK')
    throw new Error('Proxy: github request failed')

  const responseHeaders = filterResponseHeaders(response)

  if (response.redirected) responseHeaders['x-redirected-url'] = response.url

  const isSmartRequest = httpMethod === 'POST'

  return {
    body: isSmartRequest ? await response.buffer() : await response.text(),
    headers: responseHeaders,
    isBase64Encoded: isSmartRequest,
    statusCode: 200,
  }
}
