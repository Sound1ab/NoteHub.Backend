import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { FileManager, JwtManager, RepoManager, UserManager } from './services'
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
  owner: string | null
  dataSources: {
    fileManager: FileManager
    jwtManager: JwtManager
    repoManager: RepoManager
    userManager: UserManager
  }
}

export function configureServer() {
  const resolvers = {
    Mutation: {
      ...RepoMutations,
      ...FileMutations,
      ...ImageMutations,
    },
    Query: {
      ...UserQueries,
      ...RepoQueries,
      ...FileQueries,
      ...ImageQueries,
      ...AuthorizationQueries,
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
      const owner = (event.headers?.Owner || event.headers?.owner) ?? null
      const jwt =
        bearerToken && typeof bearerToken === 'string'
          ? bearerToken.substring(7, bearerToken.length)
          : null

      return {
        context,
        cookie,
        jwt,
        owner,
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
