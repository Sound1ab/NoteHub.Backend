import { AuthenticationError } from 'apollo-server-lambda'
import { IContext } from '../server'
import { QueryReadGithubUserAccessTokenArgs } from '../resolvers-types'

export const AuthorizationQueries = {
  async login(
    _,
    { code, state }: QueryReadGithubUserAccessTokenArgs,
    { cookie, dataSources: { jwtManager } }: IContext
  ): Promise<string> {
    if (!cookie) {
      throw new AuthenticationError('No cookie sent')
    }

    const refreshToken = jwtManager.parseRefreshTokenFromCookie(cookie)

    const client = await jwtManager.getClient(refreshToken)

    if (jwtManager.hasClientExpired(client)) {
      throw new AuthenticationError('Client has exipred')
    }

    const jwt = jwtManager.createJwtWithToken(
      client.encryptedAccessToken,
      client.iv
    )

    return jwt
  },
  async refresh(
    _0,
    _1,
    { context, cookie, dataSources: { jwtManager } }: IContext
  ): Promise<string> {
    if (!cookie) {
      throw new AuthenticationError('No cookie sent')
    }

    const refreshToken = jwtManager.parseRefreshTokenFromCookie(cookie)

    const client = await jwtManager.getClient(refreshToken)

    if (!jwtManager.hasClientExpired(client)) {
      throw new AuthenticationError('RefreshToken is still valid')
    }

    const { value, iv } = client

    await jwtManager.deleteClient(refreshToken)

    const regeneratedJwt = jwtManager.createJwtWithToken(value, iv)

    const regeneratedRefreshToken = jwtManager.createRefreshToken()

    await jwtManager.addClient(regeneratedRefreshToken, value, iv)

    jwtManager.addCookie(context, 'refreshToken', regeneratedRefreshToken)

    return regeneratedJwt
  },
  async logout(
    _0,
    _1,
    { context, cookie, dataSources: { jwtManager } }: IContext
  ) {
    if (!cookie) {
      throw new AuthenticationError('No cookie sent')
    }

    const refreshToken = jwtManager.parseRefreshTokenFromCookie(cookie)

    await jwtManager.deleteClient(refreshToken)

    jwtManager.removeCookie(context, 'refreshToken')

    return 'ok'
  },
}
