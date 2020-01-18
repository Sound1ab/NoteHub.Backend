import {
  GithubUser,
  QueryReadGithubUserAccessTokenArgs,
} from '../resolvers-types'

import Cookie from 'cookie'
import { DynamoManager } from '../services/aws'
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

  logout(_0, _1, { context }: any) {
    const cookie = Cookie.serialize('accessToken', '', {
      expires: new Date('August 19, 1975 23:15:30'),
      httpOnly: true,
    })

    context.addHeaders = [{ key: 'Set-Cookie', value: cookie }]

    return 'ok'
  },
}
