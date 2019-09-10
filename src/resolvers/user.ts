import {
  GithubUser,
  QueryReadGithubUserAccessTokenArgs,
} from '../resolvers-types'
import { UserManager } from '../services/octokit'

export function UserQueries() {
  return {
    readGithubUserAccessToken(
      _,
      { code, state }: QueryReadGithubUserAccessTokenArgs,
      { userManager }: { userManager: UserManager }
    ): Promise<string> {
      return userManager.readGithubUserAccessToken(code, state)
    },

    readGithubUser(
      _0,
      _1,
      { userManager }: { userManager: UserManager }
    ): Promise<GithubUser> {
      return userManager.readUser()
    },
  }
}
