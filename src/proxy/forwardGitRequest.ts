import { APIGatewayProxyEvent } from 'aws-lambda'
import { allow } from './allow'
import createHttpError from 'http-errors'
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
    isBase64Encoded,
  } = event

  const pathdomain = pathParameters?.proxy

  if (!pathdomain) throw new createHttpError.BadRequest()

  const requestHeaders: Record<
    string,
    string
  > = await replaceAuthorizationHeader(headers)

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
    // lambda-proxy binary request payloads are always converted to base64
    // serverless-offline is not so we need to convert back to a buffer
    // when running in api gateway
    body: !requestBody
      ? undefined
      : isBase64Encoded
      ? Buffer.from(requestBody, 'base64')
      : requestBody,
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
    body: isSmartRequest
      ? Buffer.from(await response.buffer()).toString('base64')
      : await response.text(),
    headers: responseHeaders,
    isBase64Encoded: isSmartRequest,
    statusCode: 200,
  }
}
