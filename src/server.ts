import { ApolloServer, AuthenticationError } from 'apollo-server-lambda'
import { FileManager, JwtManager, RepoManager, UserManager } from './services'
import { FileMutations, FileQueries } from './resolvers/file'
import { ImageMutations, ImageQueries } from './resolvers/image'
import { RepoMutations, RepoQueries } from './resolvers/repo'

import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { AuthorizationQueries } from './resolvers/authorization'
import { ERRORS } from './errors'
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
    context: ({ event, context }: any) => {
      const body = JSON.parse(event.body)
      const isLogin = body.query.toLowerCase().includes('login')
      const isReadGithubUserAccessToken = body.query
        .toLowerCase()
        .includes('readgithubuseraccesstoken')
      const isIntrospectionQuery = body.query
        .toLowerCase()
        .includes('IntrospectionQuery')

      if (isLogin) {
        return {
          context,
          event,
          jwtManager: new JwtManager(),
        }
      }

      if (isReadGithubUserAccessToken) {
        return {
          context,
          jwtManager: new JwtManager(),
          userManager: new UserManager(),
        }
      }

      if (!isIntrospectionQuery) {
        return {
          context,
          event,
        }
      }

      const bearerToken = event.headers.Authorization

      let jwt: string

      if (bearerToken.startsWith('Bearer ')) {
        jwt = bearerToken.substring(7, bearerToken.length)
      } else {
        throw new AuthenticationError('No Bearer token')
      }

      const jwtManager = new JwtManager()

      const {
        body: { accessToken: encryptedAccessToken, iv },
      } = jwtManager.verifyJwt(jwt)

      const accessToken = jwtManager.decrypt(encryptedAccessToken, iv)

      return {
        accessToken,
        context,
        event,
        fileManager: new FileManager(accessToken),
        headers: event.headers,
        jwtManager,
        repoManager: new RepoManager(accessToken),
        userManager: new UserManager(accessToken),
      }
    },
    formatError: (error: Error): GraphQLFormattedError => {
      const githubAuthError = error.message === 'Bad credentials'

      const formattedError = githubAuthError
        ? ERRORS.AUTHENTICATION_ERROR
        : error

      return formattedError as GraphQLFormattedError
    },
    plugins: [customHeadersPlugin],
    resolvers,
    typeDefs: generateTypedefs(),
  })
}
