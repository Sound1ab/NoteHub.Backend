import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'

import { refresh as _refresh } from './refresh'
import { configureServer } from './server'
import cors from '@middy/http-cors'
import { forwardGitRequest } from './proxy/forwardGitRequest'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import middy from '@middy/core'

export const graphql = configureServer().createHandler({
  cors: {
    credentials: true,
    origin: true,
  },
})

export const webhook: APIGatewayProxyHandler = async event => {
  console.log('we got the hook!', event)
  return {
    body: JSON.stringify(
      {
        input: event,
        message: 'Webhook received!',
      },
      null,
      2
    ),
    statusCode: 200,
  }
}

export const proxy = middy(async (event: APIGatewayProxyEvent) => {
  return forwardGitRequest(event)
})
  .use(
    cors({
      credentials: true,
      headers: 'Authorization',
      origins: [
        'http://noted-development.s3-website-eu-west-1.amazonaws.com',
        'https://notehub.xyz',
        'https://www.notehub.xyz',
      ],
    })
  )
  .use(httpErrorHandler())
  .use(httpHeaderNormalizer())

export const refresh = middy(async (event: APIGatewayProxyEvent) => {
  const { regeneratedJwt, regeneratedCookie } = await _refresh(event)

  return {
    body: JSON.stringify(regeneratedJwt),
    headers: {
      'Set-Cookie': regeneratedCookie,
    },
    statusCode: 200,
  }
})
  .use(
    cors({
      credentials: true,
      headers: 'Authorization',
      origins: [
        'http://noted-development.s3-website-eu-west-1.amazonaws.com',
        'https://notehub.xyz',
        'https://www.notehub.xyz',
      ],
    })
  )
  .use(httpErrorHandler())
  .use(httpHeaderNormalizer())
