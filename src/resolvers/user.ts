import {
  GithubUser,
  QueryReadGithubUserAccessTokenArgs,
} from '../resolvers-types'

import { IContext } from '../server'

export const UserQueries = {
  async readGithubUserAccessToken(
    _,
    { code, state }: QueryReadGithubUserAccessTokenArgs,
    { context, dataSources: { userManager, jwtManager } }: IContext
  ): Promise<string> {
    const accessToken = await userManager.readGithubUserAccessToken(code, state)

    const { value, iv } = jwtManager.encrypt(accessToken)

    const jwt = jwtManager.createJwtWithToken(value, iv)

    const refreshToken = jwtManager.createRefreshToken()

    await jwtManager.addClient(refreshToken, value, iv)

    jwtManager.addCookie(context, 'refreshToken', refreshToken)

    return jwt
  },
  readGithubUser(
    _0,
    _1,
    { dataSources: { userManager } }: IContext
  ): Promise<GithubUser> {
    return userManager.readUser()
  },
}
