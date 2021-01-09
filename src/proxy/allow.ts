import { APIGatewayProxyEvent } from 'aws-lambda'
import { lowerCaseObjectProps } from './lowerCaseObjectProps'

export function allow(event: APIGatewayProxyEvent) {
  const { httpMethod, headers, path, queryStringParameters } = event

  const lowerCasedHeaders = lowerCaseObjectProps(headers)

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
    lowerCasedHeaders['access-control-request-headers'].includes(
      'content-type'
    ) &&
    path.endsWith('git-upload-pack')
  )
    return true
  if (
    httpMethod === 'POST' &&
    lowerCasedHeaders['content-type'] ===
      'application/x-git-upload-pack-request' &&
    path.endsWith('git-upload-pack')
  )
    return true
  if (
    httpMethod === 'OPTIONS' &&
    lowerCasedHeaders['access-control-request-headers'].includes(
      'content-type'
    ) &&
    path.endsWith('git-receive-pack')
  )
    return true
  if (
    httpMethod === 'POST' &&
    lowerCasedHeaders['content-type'] ===
      'application/x-git-receive-pack-request' &&
    path.endsWith('git-receive-pack')
  )
    return true

  throw new Error('Request not allowed')
}
