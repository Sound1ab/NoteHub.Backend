import { FileManager, RepoManager, UserManager } from './services/octokit'
import { FileMutations, FileQueries } from './resolvers/file'
import { ImageMutations, ImageQueries } from './resolvers/image'
import { RepoMutations, RepoQueries } from './resolvers/repo'

import { ApolloServer } from 'apollo-server-lambda'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import Cookie from 'cookie'
import { DynamoManager } from './services/aws'
import { ERRORS } from './errors'
import { GraphQLFormattedError } from 'graphql'
import { UserQueries } from './resolvers/user'
import { generateTypedefs } from './schema'

function initManagers(token: string) {
  const fileManager = new FileManager(token)
  const repoManager = new RepoManager(token)
  const userManager = new UserManager(token)
  const dynamoManager = new DynamoManager()

  return { fileManager, repoManager, userManager, dynamoManager }
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
      const { accessToken = '' } = Cookie.parse(event.headers?.Cookie ?? '')

      const managers = initManagers(accessToken)

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
