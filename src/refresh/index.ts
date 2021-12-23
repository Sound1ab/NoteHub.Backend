import { JwtManager, UserManager } from '../services'
import { createCookie, decrypt, parseRefreshTokenFromCookie } from '../utils'

import { APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

export async function refresh(event: APIGatewayProxyEvent) {
  const { headers } = event

  const { cookie, authorization } = headers

  if (!cookie || !authorization) {
    throw new createHttpError.Unauthorized()
  }

  const jwtManager = new JwtManager()

  const userManager = new UserManager({ jwt: null })

  const refreshToken = parseRefreshTokenFromCookie(cookie)

  const { encryptedAccessToken, iv } = await jwtManager.getClient(refreshToken)

  // await jwtManager.deleteClient(refreshToken)

  const accessToken = decrypt(encryptedAccessToken, iv)

  const owner = await userManager
    .initOctokitWithAccessToken(accessToken)
    .readUser()

  const regeneratedJwt: string = jwtManager
    .createJwtWithToken(encryptedAccessToken, iv, owner)
    .compact()

  const regeneratedRefreshToken = jwtManager.createRefreshToken()

  await jwtManager.addClient(regeneratedRefreshToken, encryptedAccessToken, iv)

  const regeneratedCookie = createCookie(
    'refreshToken',
    regeneratedRefreshToken
  )

  return { regeneratedJwt, regeneratedCookie }
}
