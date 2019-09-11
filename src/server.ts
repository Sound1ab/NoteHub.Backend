import { ApolloServer } from 'apollo-server-lambda'
import { GraphQLFormattedError } from 'graphql'
import { ERRORS } from './errors'
import { FileMutations, FileQueries } from './resolvers/file'
import { ImageMutations, ImageQueries } from './resolvers/image'
import { RepoMutations, RepoQueries } from './resolvers/repo'
import { UserQueries } from './resolvers/user'
import { generateTypedefs } from './schema'
import { FileManager, RepoManager, UserManager } from './services/octokit'

function initManagers(token: string) {
  const fileManager = new FileManager(token)
  const repoManager = new RepoManager(token)
  const userManager = new UserManager(token)

  return { fileManager, repoManager, userManager }
}

export function configureServer() {
  const resolvers = {
    Mutation: {
      ...RepoMutations(),
      ...FileMutations(),
      ...ImageMutations(),
    },
    Query: {
      ...UserQueries(),
      ...RepoQueries(),
      ...FileQueries(),
      ...ImageQueries(),
    },
  }
  return new ApolloServer({
    context: ({ event, context }: any) => {
      const token = event.headers.Authorization
      const managers = initManagers(token)

      return {
        ...context,
        ...managers,
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
    resolvers,
    typeDefs: generateTypedefs(),
  })
}