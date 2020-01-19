import {
  GithubUser,
  QueryReadGithubUserAccessTokenArgs,
} from '../resolvers-types'
import { JwtManager, UserManager } from '../services'

export const UserQueries = {
  async readGithubUserAccessToken(
    _,
    { code, state }: QueryReadGithubUserAccessTokenArgs,
    {
      context,
      userManager,
      jwtManager,
    }: { userManager: UserManager; jwtManager: JwtManager; context: any }
  ): Promise<string> {
    const accessToken = await userManager.readGithubUserAccessToken(code, state)

    const {
      jwt,
      refreshToken,
    } = await jwtManager.generateTokensAndStoreRefresh(accessToken)

    jwtManager.addCookie(context, 'refreshToken', refreshToken)

    return jwt
  },
  readGithubUser(
    _0,
    _1,
    { userManager }: { userManager: UserManager }
  ): Promise<GithubUser> {
    return userManager.readUser()
  },
}
