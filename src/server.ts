import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { FileManager, JwtManager, RepoManager, UserManager } from './services'
import { FileMutations, FileQueries } from './resolvers/file'
import { ImageMutations, ImageQueries } from './resolvers/image'
import { RepoMutations, RepoQueries } from './resolvers/repo'

import { ApolloServer } from 'apollo-server-lambda'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { AuthenticationError } from 'apollo-server-lambda'
import { AuthorizationQueries } from './resolvers/authorization'
import { GraphQLFormattedError } from 'graphql'
import { UserQueries } from './resolvers/user'
import { generateTypedefs } from './schema'

const customHeadersPlugin: ApolloServerPlugin = {
  requestDidStart() {
    return {
      willSendResponse(requestContext: any) {
        const {
          context: { addHeaders = [] },
        } = requestContext.context

        addHeaders.forEach(({ key, value }: any) => {
          requestContext.response.http.headers.append(key, value)
        })

        return requestContext
      },
    }
  },
}

export interface IContext {
  context: Record<string, any>
  jwt: string | null
  cookie: string | null
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
      const bearerToken = event.headers?.Authorization ?? ''
      const cookie = event.headers?.Cookie ?? null

      let jwt: string | null = null

      if (bearerToken.startsWith('Bearer ')) {
        jwt = bearerToken.substring(7, bearerToken.length)
      }

      return {
        context,
        cookie,
        jwt,
      }
    },
    dataSources: () => {
      return {
        fileManager: new FileManager(),
        jwtManager: new JwtManager(),
        repoManager: new RepoManager(),
        userManager: new UserManager(),
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
    plugins: [customHeadersPlugin],
    resolvers,
    typeDefs: generateTypedefs(),
  })
}
