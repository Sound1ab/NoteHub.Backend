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
  private context: Record<string, any>

  constructor() {
    const tableName = process.env.DYNAMODB_TABLE

    if (!tableName) {
      throw new Error('No tablename set')
    }

    this.dynamoManager = new DynamoManager(tableName)
  }

  public initialize(config: { context: Record<string, any> }): void {
    this.context = config.context
  }

  public createJwtWithToken(encryptedAccessToken: string, iv: string) {
    const claims = {
      accessToken: encryptedAccessToken,
      iss: 'http://softnote.com/',
      iv,
    }

    const jwt = nJwt.create(claims, jwtSigningKey)
    return jwt.compact()
  }

  public createRefreshToken() {
    return randtoken.uid(256)
  }

  public getJwtValues(jwt: string) {
    try {
      return nJwt.verify(jwt, jwtSigningKey)
    } catch (error) {
      throw new AuthenticationError('JWT is not valid')
    }
  }

  public async getClient(refreshToken: string) {
    const result = await this.dynamoManager.read(refreshToken)

    if (!result.Item) {
      throw new AuthenticationError('Client does not exist')
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
