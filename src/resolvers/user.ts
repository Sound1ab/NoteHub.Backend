import {
  GithubUser,
  QueryReadGithubUserAccessTokenArgs,
} from '../resolvers-types'

import Cookie from 'cookie'
import { UserManager } from '../services/octokit'

export const UserQueries = {
  async readGithubUserAccessToken(
    _,
    { code, state }: QueryReadGithubUserAccessTokenArgs,
    { context, userManager }: { userManager: UserManager } & any
  ): Promise<string> {
    const accessToken = await userManager.readGithubUserAccessToken(code, state)

    const cookie = Cookie.serialize('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    context.addHeaders = [{ key: 'Set-Cookie', value: cookie }]

    return 'ok'
  },

  readGithubUser(
    _0,
    _1,
    { userManager }: { userManager: UserManager }
  ): Promise<GithubUser> {
    return userManager.readUser()
  },
}
