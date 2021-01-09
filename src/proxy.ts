import { APIGatewayProxyEvent } from 'aws-lambda'
import fetch from 'node-fetch'

const allowHeaders = [
  'accept-encoding',
  'accept-language',
  'accept',
  'access-control-allow-origin',
  'authorization',
  'cache-control',
  'connection',
  'content-length',
  'content-type',
  'dnt',
  'pragma',
  'range',
  'referer',
  'user-agent',
  'x-authorization',
  'x-http-method-override',
  'x-requested-with',
]
const exposeHeaders = [
  'accept-ranges',
  'age',
  'cache-control',
  'content-length',
  'content-language',
  'content-type',
  'date',
  'etag',
  'expires',
  'last-modified',
  'pragma',
  'server',
  'transfer-encoding',
  'vary',
  'x-github-request-id',
  'x-redirected-url',
]

export async function forwardGitRequest(event: APIGatewayProxyEvent) {
  if (!allow(event)) {
    return {
      body: JSON.stringify('event type not allowed'),
      statusCode: 404,
    }
  }

  const {
    httpMethod,
    pathParameters,
    queryStringParameters,
    body: requestBody,
  } = event

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
    }
  }

  const pathdomain = pathParameters?.proxy

  if (!pathdomain) {
    return {
      body: JSON.stringify('pathdomain missing'),
      statusCode: 404,
    }
  }

  const headers: Record<string, any> = {}

  for (const headername of allowHeaders) {
    if (event.headers[headername]) {
      headers[headername] = event.headers[headername]
    }
  }

  // GitHub uses user-agent sniffing for git/* and changes its behavior which is frustrating
  if (!headers['user-agent'] || !headers['user-agent'].startsWith('git/')) {
    headers['user-agent'] = 'git/@isomorphic-git/cors-proxy'
  }

  const queryString = queryStringParameters
    ? Object.entries(queryStringParameters).reduce((acc, [prop, value]) => {
        acc = `${prop}=${value}`
        return acc
      }, '')
    : null

  const base = `https://${pathdomain}`

  const url = queryString ? `${base}?${queryString}` : base

  const response = await fetch(url, {
    body: requestBody ? requestBody : undefined,
    headers,
    method: httpMethod,
  })

  if (response.status !== 200 || response.statusText !== 'OK') {
    return {
      body: JSON.stringify('github request failed'),
      statusCode: 404,
    }
  }

  const responseHeaders: Record<string, any> = {}

  for (const headername of exposeHeaders) {
    if (headername === 'content-length') continue
    if (response.headers.has(headername)) {
      responseHeaders[headername] = response.headers.get(headername)
    }
  }

  if (response.redirected) responseHeaders['x-redirected-url'] = response.url

  const isSmartRequest = httpMethod === 'POST'

  return {
    body: isSmartRequest ? await response.buffer() : await response.text(),
    headers: responseHeaders,
    isBase64Encoded: isSmartRequest,
    statusCode: 200,
  }
}

function allow(event: APIGatewayProxyEvent) {
  const { httpMethod, headers, path, queryStringParameters } = event

  if (
    httpMethod === 'OPTIONS' &&
    path.endsWith('/info/refs') &&
    (queryStringParameters?.service === 'git-upload-pack' ||
      queryStringParameters?.service === 'git-receive-pack')
  )
    return true
  if (
    httpMethod === 'GET' &&
    path.endsWith('/info/refs') &&
    (queryStringParameters?.service === 'git-upload-pack' ||
      queryStringParameters?.service === 'git-receive-pack')
  )
    return true
  if (
    httpMethod === 'OPTIONS' &&
    headers['access-control-request-headers'].includes('content-type') &&
    path.endsWith('git-upload-pack')
  )
    return true
  if (
    httpMethod === 'POST' &&
    headers['content-type'] === 'application/x-git-upload-pack-request' &&
    path.endsWith('git-upload-pack')
  )
    return true
  if (
    httpMethod === 'OPTIONS' &&
    headers['access-control-request-headers'].includes('content-type') &&
    path.endsWith('git-receive-pack')
  )
    return true
  if (
    httpMethod === 'POST' &&
    headers['content-type'] === 'application/x-git-receive-pack-request' &&
    path.endsWith('git-receive-pack')
  )
    return true
  return false
}
