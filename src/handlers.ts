import { APIGatewayProxyHandler } from 'aws-lambda'
import { configureServer } from './server'

export const graphql = configureServer().createHandler({
  cors: {
    credentials: true,
    origin: '*',
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
