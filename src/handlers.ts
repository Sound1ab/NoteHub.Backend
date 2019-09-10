import { APIGatewayProxyHandler } from 'aws-lambda'
import { server } from './server'

export const graphql = server.createHandler({
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
