import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import {
  ConfigurationMutations,
  ConfigurationQueries,
} from './resolvers/configuration'
import { FileMutations, FileQueries } from './resolvers/file'
import { ImageMutations, ImageQueries } from './resolvers/image'
import { RepoMutations, RepoQueries } from './resolvers/repo'

import { ApolloServer } from 'apollo-server-lambda'
import { AuthenticationError } from 'apollo-server-lambda'
import { AuthorizationQueries } from './resolvers/authorization'
import { GraphQLFormattedError } from 'graphql'
import { UserQueries } from './resolvers/user'
import { addHeadersFromContext } from './utils'
import { generateTypedefs } from './schema'

export interface IContext {
  context: Record<string, any>
  jwt: string | null
  cookie: string | null
}

export function configureServer() {
  const resolvers = {
    Mutation: {
      ...RepoMutations,
      ...FileMutations,
      ...ImageMutations,
      ...ConfigurationMutations,
    },
    Query: {
      ...UserQueries,
      ...RepoQueries,
      ...FileQueries,
      ...ImageQueries,
      ...AuthorizationQueries,
      ...ConfigurationQueries,
    },
  }
  return new ApolloServer({
    context: ({
      event,
      context,
    }: {
      event: APIGatewayProxyEvent
      context: Context
    }) => {
      const bearerToken = event.headers?.Authorization

      const cookie = event.headers?.Cookie ?? null

      const jwt =
        bearerToken && typeof bearerToken === 'string'
          ? bearerToken.substring(7, bearerToken.length)
          : null

      return {
        context,
        cookie,
        jwt,
      }
    },
    formatError: (error: Error): GraphQLFormattedError => {
      const githubAuthError = error.message === 'Bad credentials'

      const formattedError = githubAuthError
        ? new AuthenticationError(
            'You must be authorized to access this schema'
          )
        : error

      return formattedError as GraphQLFormattedError
    },
    plugins: [addHeadersFromContext],
    resolvers,
    typeDefs: generateTypedefs(),
  })
}
