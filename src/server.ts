import { FileManager, RepoManager, UserManager } from './services/octokit'
import { FileMutations, FileQueries } from './resolvers/file'
import { ImageMutations, ImageQueries } from './resolvers/image'
import { RepoMutations, RepoQueries } from './resolvers/repo'

import { ApolloServer } from 'apollo-server-lambda'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import Cookie from 'cookie'
import { ERRORS } from './errors'
import { GraphQLFormattedError } from 'graphql'
import { UserQueries } from './resolvers/user'
import { generateTypedefs } from './schema'

function initManagers(token: string) {
  const fileManager = new FileManager(token)
  const repoManager = new RepoManager(token)
  const userManager = new UserManager(token)

  return { fileManager, repoManager, userManager }
}

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
    },
  }
  return new ApolloServer({
    context: ({ event, context }: any) => {
      const body = JSON.parse(event.body)

      let managers: any

      if (body.operationName === 'ReadGithubUserAccessToken') {
        managers = initManagers('')
      } else {
        if (!event.headers?.Cookie) {
          throw ERRORS.AUTHENTICATION_ERROR
        }

        const result = Cookie.parse(event.headers.Cookie)

        if (!result?.accessToken) {
          throw ERRORS.AUTHENTICATION_ERROR
        }

        managers = initManagers(result.accessToken)
      }

      return {
        ...managers,
        context,
        event,
        headers: event.headers,
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
