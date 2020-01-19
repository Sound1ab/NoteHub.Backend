import { AuthenticationError } from 'apollo-server-lambda'
import { JwtManager } from '../services'
import { QueryReadGithubUserAccessTokenArgs } from '../resolvers-types'

export const AuthorizationQueries = {
  async login(
    _,
    { code, state }: QueryReadGithubUserAccessTokenArgs,
    {
      event,
      jwtManager,
    }: {
      event: any
      jwtManager: JwtManager
    }
  ): Promise<string> {
    const refreshToken = jwtManager.parseRefreshTokenFromCookie(
      event.headers?.Cookie
    )

    const accessToken = await jwtManager.verifyRefreshToken(refreshToken)

    if (!accessToken) {
      throw new AuthenticationError(
        'RefreshToken has expired, please log back in'
      )
    }

    const { jwt } = jwtManager.createJwtWithToken(accessToken)

    return jwt
  },
  async refresh(
    _0,
    _1,
    {
      context,
      event,
      jwtManager,
      accessToken,
    }: {
      event: any
      jwtManager: JwtManager
      accessToken: string
      context: any
    }
  ): Promise<string> {
    const refreshToken = jwtManager.parseRefreshTokenFromCookie(
      event.headers?.Cookie
    )

    const {
      jwt,
      refreshToken: newRefreshToken,
    } = await jwtManager.regenerateTokens(accessToken, refreshToken)

    jwtManager.addCookie(context, 'refreshToken', newRefreshToken)

    return jwt
  },
  async logout(
    _0,
    _1,
    {
      event,
      context,
      jwtManager,
    }: {
      event: any
      jwtManager: JwtManager
      context: any
    }
  ) {
    const refreshToken = jwtManager.parseRefreshTokenFromCookie(
      event.headers?.Cookie
    )

    await jwtManager.deleteRefresh(refreshToken)

    jwtManager.removeCookie(context, 'refreshToken')

    return 'ok'
  },
}
