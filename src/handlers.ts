import { APIGatewayProxyHandler } from 'aws-lambda'
import { forwardGitRequest } from './proxy'
import { configureServer } from './server'

export const graphql = configureServer().createHandler({
  cors: {
    credentials: true,
    origin: true,
  },
})

export const hello: APIGatewayProxyHandler = async event => {
  return {
    body: JSON.stringify(
      {
        input: event,
        message: 'API is up and running!',
      },
      null,
      2
    ),
    statusCode: 200,
  }
}

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

export const proxy = async (event: any) => {
  return forwardGitRequest(event)
}
