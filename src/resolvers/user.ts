import {
  GithubUser,
  QueryReadGithubUserAccessTokenArgs,
} from '../resolvers-types'
import { addCookie, encrypt } from '../utils'

import { IContext } from '../server'

export const UserQueries = {
  async readGithubUserAccessToken(
    _: any,
    { code, state }: QueryReadGithubUserAccessTokenArgs,
    { context, dataSources: { userManager, jwtManager } }: IContext
  ): Promise<string> {
    const accessToken = await userManager.readGithubUserAccessToken(code, state)

    const { value, iv } = encrypt(accessToken)

    const jwt = jwtManager.createJwtWithToken(value, iv).compact()

    const refreshToken = jwtManager.createRefreshToken()

    await jwtManager.addClient(refreshToken, value, iv)

    addCookie(context, 'refreshToken', refreshToken)

    return jwt
  },
  readGithubUser(
    _0: any,
    _1: any,
    { dataSources: { userManager } }: IContext
  ): Promise<GithubUser> {
    return userManager.readUser()
  },
}
