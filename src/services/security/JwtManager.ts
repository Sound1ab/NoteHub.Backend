import { AuthenticationError } from 'apollo-server-lambda'
import Cookie from 'cookie'
import { DynamoManager } from '..'
import crypto from 'crypto'
import nJwt from 'njwt'
import randtoken from 'rand-token'

const jwtSigningKey = process.env.SERVERLESS_APP_JWT_SIGNING_KEY!
const tokenSigningKey = process.env.SERVERLESS_APP_TOKEN_SIGNING_KEY!

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

  public createJwtWithToken(accessToken: string) {
    const { value, iv } = this.encrypt(accessToken)

    const claims = {
      accessToken: value,
      iss: 'http://softnote.com/',
      iv,
    }

    const jwt = nJwt.create(claims, jwtSigningKey)
    return { jwt: jwt.compact(), encryptedAccessToken: value }
  }

  public createRefreshToken() {
    return randtoken.uid(256)
  }

  public async generateTokensAndStoreRefresh(accessToken: string) {
    const { jwt, encryptedAccessToken } = this.createJwtWithToken(accessToken)
    const refreshToken = await this.createAndAddRefreshToken(
      encryptedAccessToken
    )

    return { jwt, refreshToken }
  }

  public async regenerateTokens(accessToken: string, refreshToken: string) {
    const encryptedAccesstoken = await this.verifyRefreshToken(refreshToken)

    if (encryptedAccesstoken) {
      throw new Error('Refresh token is still valid')
    }

    return this.generateTokensAndStoreRefresh(accessToken)
  }

  public verifyJwt(jwt: string) {
    try {
      return nJwt.verify(jwt, jwtSigningKey)
    } catch (error) {
      throw new AuthenticationError('JWT is not valid, please log back in')
    }
  }

  public async verifyRefreshToken(refreshToken: string) {
    const result = await this.dynamoManager.read(refreshToken)

    if (!result.Item?.expires) {
      throw new AuthenticationError('Refresh token is not valid, please log in')
    }

    const now = new Date().getTime()
    const expires = result.Item.expires

    if (expires < now) {
      this.deleteRefresh(refreshToken)
      return
    }

    return result.Item.accessToken
  }

  public async deleteRefresh(refreshToken: string) {
    return this.dynamoManager.delete(refreshToken)
  }

  public async createAndAddRefreshToken(accessToken: string) {
    const refreshToken = this.createRefreshToken()
    await this.dynamoManager.create(refreshToken, {
      accessToken,
      expires: JwtManager.aWeekFromNow(),
    })
    return refreshToken
  }

  public addCookie(context: any, name: string, value: string) {
    const cookie = Cookie.serialize(name, value, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    context.addHeaders = [{ key: 'Set-Cookie', value: cookie }]
  }

  public removeCookie(context: any, name: string) {
    const cookie = Cookie.serialize(name, '', {
      expires: new Date('August 19, 1975 23:15:30'),
      httpOnly: true,
    })

    context.addHeaders = [{ key: 'Set-Cookie', value: cookie }]
  }

  public parseRefreshTokenFromCookie(cookie?: string) {
    if (!cookie) {
      throw new Error('No cookie present')
    }
    const parsedCookie = Cookie.parse(cookie)

    if (!parsedCookie.refreshToken) {
      throw new AuthenticationError('No refreshToken')
    }

    return parsedCookie.refreshToken
  }

  public encrypt(value: string): { value: string; iv: string } {
    const key = crypto
      .createHash('sha256')
      .update(String(tokenSigningKey))
      .digest('base64')
      .substr(0, 32)
    const iv = new Buffer(crypto.randomBytes(8)).toString('hex')
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv)
    const crypted = cipher.update(value, 'utf8', 'hex')
    return { value: `${crypted}${cipher.final('hex')}`, iv }
  }

  public decrypt(value: string, iv: string): string {
    const key = crypto
      .createHash('sha256')
      .update(String(tokenSigningKey))
      .digest('base64')
      .substr(0, 32)
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv)
    const dec = decipher.update(value, 'hex', 'utf8')
    return `${dec}${decipher.final('utf8')}`
  }
}
