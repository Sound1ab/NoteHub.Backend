import {
  JwtExpiredError,
  JwtSignatureMismatchError,
  RefreshTokenExpiredError,
  RefreshTokenNotValidError,
  nJwtErrors,
} from '../../errors'

import { AuthenticationError } from 'apollo-server-lambda'
import { DynamoManager } from '..'
import nJwt from 'njwt'
import randtoken from 'rand-token'

export class JwtManager {
  private static aWeekFromNow() {
    const now = new Date()
    return now.setDate(now.getDate() + 7).toString()
  }

  private dynamoManager: DynamoManager

  constructor() {
    const tableName = process.env.DYNAMODB_TABLE

    if (!tableName) {
      throw new Error('No tablename set')
    }

    this.dynamoManager = new DynamoManager(tableName)
  }

  public createJwtWithToken(
    encryptedAccessToken: string,
    iv: string,
    {
      login,
      avatar_url,
      html_url,
    }: { login: string; avatar_url: string; html_url: string }
  ) {
    const jwtSigningKey = process.env.SERVERLESS_APP_JWT_SIGNING_KEY!

    const claims = {
      accessToken: encryptedAccessToken,
      avatar_url,
      html_url,
      iss: 'http://notehub.xyz/',
      iv,
      login,
    }

    const jwt = nJwt.create(claims, jwtSigningKey)

    // jwt.setExpiration(new Date().getTime() + 10 * 1000)

    return jwt
  }

  public createRefreshToken() {
    return randtoken.uid(256)
  }

  public getJwtValues(jwt: string) {
    const jwtSigningKey = process.env.SERVERLESS_APP_JWT_SIGNING_KEY!

    try {
      return nJwt.verify(jwt, jwtSigningKey)
    } catch (error) {
      switch (error.message) {
        case nJwtErrors.EXPIRED:
          throw new JwtExpiredError()
        case nJwtErrors.SIGNATURE_MISMTACH:
          throw new JwtSignatureMismatchError()
        default:
          throw new AuthenticationError(error.message)
      }
    }
  }

  public async getClient(refreshToken: string) {
    const result = await this.dynamoManager.read(refreshToken)

    if (!result?.Item) {
      throw new RefreshTokenNotValidError()
    }

    if (this.hasClientExpired(result.Item)) {
      throw new RefreshTokenExpiredError()
    }

    return result.Item
  }

  public async addClient(
    refreshToken: string,
    encryptedAccessToken: string,
    iv: string
  ) {
    return this.dynamoManager.create(refreshToken, {
      encryptedAccessToken,
      expires: JwtManager.aWeekFromNow(),
      iv,
    })
  }

  public async deleteClient(refreshToken: string) {
    return this.dynamoManager.delete(refreshToken)
  }

  public hasClientExpired(client: any) {
    const now = new Date().getTime()
    const expires = client.expires

    return expires < now
  }
}
