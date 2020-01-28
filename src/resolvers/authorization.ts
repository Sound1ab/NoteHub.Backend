import { addCookie, parseRefreshTokenFromCookie, removeCookie } from '../utils'

import { AuthenticationError } from 'apollo-server-lambda'
import { IContext } from '../server'

export const AuthorizationQueries = {
  async login(
    _0: any,
    _1: any,
    { cookie, dataSources: { jwtManager } }: IContext
  ): Promise<string> {
    if (!cookie) {
      throw new AuthenticationError('No cookie sent')
    }

    const refreshToken = parseRefreshTokenFromCookie(cookie)

    const { encryptedAccessToken, iv } = await jwtManager.getClient(
      refreshToken
    )

    return jwtManager.createJwtWithToken(encryptedAccessToken, iv).compact()
  },
  async refresh(
    _0: any,
    _1: any,
    { context, cookie, dataSources: { jwtManager } }: IContext
  ): Promise<string> {
    if (!cookie) {
      throw new AuthenticationError('No cookie sent')
    }

    const refreshToken = parseRefreshTokenFromCookie(cookie)

    const client = await jwtManager.getClient(refreshToken)

    const { encryptedAccessToken, iv } = client

    await jwtManager.deleteClient(refreshToken)

    const regeneratedJwt = jwtManager
      .createJwtWithToken(encryptedAccessToken, iv)
      .compact()

    const regeneratedRefreshToken = jwtManager.createRefreshToken()

    await jwtManager.addClient(
      regeneratedRefreshToken,
      encryptedAccessToken,
      iv
    )

    addCookie(context, 'refreshToken', regeneratedRefreshToken)

    return regeneratedJwt
  },
  async logout(
    _0: any,
    _1: any,
    { context, cookie, dataSources: { jwtManager } }: IContext
  ) {
    if (!cookie) {
      throw new AuthenticationError('No cookie sent')
    }

    const refreshToken = parseRefreshTokenFromCookie(cookie)

    await jwtManager.deleteClient(refreshToken)

    removeCookie(context, 'refreshToken')

    return 'ok'
  },
}
