import { APIGatewayProxyHandler } from 'aws-lambda'
import { configureServer } from './server'
import { forwardGitRequest } from './proxy/forwardGitRequest'

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
  try {
    const response = await forwardGitRequest(event)

    return {
      ...response,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Authorization',
        'Access-Control-Allow-Origin': '*',
      },
    }
  } catch (e) {
    return {
      body: JSON.stringify(e.message),
      statusCode: 500,
    }
  }
}
