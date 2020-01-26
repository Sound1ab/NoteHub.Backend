import { DynamoManager } from '..'
import { JwtManager } from './JwtManager'

process.env.DYNAMODB_TABLE = 'mock'
process.env.SERVERLESS_APP_JWT_SIGNING_KEY = '1234'

jest.mock('../aws/DynamoManager')

describe('JwtManager', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should construct itself if called with new', async () => {
    const jwtManager = new JwtManager()
    const test = jwtManager instanceof JwtManager
    expect(test).toBe(true)
  })

  describe('getJwtValue', () => {
    it('should return decompressed jwt if verification succeeds', async () => {
      const jwtManager = new JwtManager()
      const encryptedAccessToken = 'MOCK_ACCESS_TOKEN'
      const iv = 'MOCK_IV'
      const jwt = jwtManager
        .createJwtWithToken(encryptedAccessToken, iv)
        .compact()

      const {
        body: { accessToken },
      } = jwtManager.getJwtValues(jwt) as any

      expect(accessToken).toBe(encryptedAccessToken)
    })

    it('should throw JwtExpiredError if jwt has expired', async () => {
      const jwtManager = new JwtManager()
      const encryptedAccessToken = 'MOCK_ACCESS_TOKEN'
      const iv = 'MOCK_IV'

      const jwt = jwtManager.createJwtWithToken(encryptedAccessToken, iv)

      jwt.setExpiration(new Date().getTime() - 60 * 60 * 1000)

      expect(() => jwtManager.getJwtValues(jwt.compact())).toThrow(
        'JWT has expired'
      )
    })

    it('should throw JwtSignatureMismatch if jwt is tampered with', async () => {
      const jwtManager = new JwtManager()
      const encryptedAccessToken = 'MOCK_ACCESS_TOKEN'
      const iv = 'MOCK_IV'

      const jwt = jwtManager.createJwtWithToken(encryptedAccessToken, iv)

      const base64EncodedJwt = jwt.compact()

      const [header, body, signiture] = base64EncodedJwt.split('.')

      const decodedBody = JSON.parse(Buffer.from(body, 'base64').toString())

      decodedBody.accessToken = 'MODIFIED_ACCESS_TOKEN'

      const reencodedbody = Buffer.from(JSON.stringify(decodedBody)).toString(
        'base64'
      )

      const reformedJwt = [header, reencodedbody, signiture].join('.')

      expect(() => jwtManager.getJwtValues(reformedJwt)).toThrow(
        'JWT signature mismatch'
      )
    })
  })

  describe('getClient', () => {
    it('should return client if client exists', async () => {
      const client = {
        encryptedAccessToken: 'MOCK_ENCRYPTED_ACCESS_TOKEN',
        expires: new Date().getTime() + 60 * 60 * 1000,
        id: 'MOCK_REFRESH_TOKEN',
        iv: 'MOCK_IV',
      }
      ;(DynamoManager as jest.Mock).mockImplementation(function() {
        // @ts-ignore
        this.read = () => Promise.resolve({ Item: client })
      })

      const jwtManager = new JwtManager()

      expect(await jwtManager.getClient(client.id)).toBe(client)
    })

    it('should throw if refresh token has expired', async () => {
      const client = {
        encryptedAccessToken: 'MOCK_ENCRYPTED_ACCESS_TOKEN',
        expires: new Date().getTime() - 60 * 60 * 1000,
        id: 'MOCK_REFRESH_TOKEN',
        iv: 'MOCK_IV',
      }
      ;(DynamoManager as jest.Mock).mockImplementation(function() {
        // @ts-ignore
        this.read = () => Promise.resolve({ Item: client })
      })

      const jwtManager = new JwtManager()

      await expect(jwtManager.getClient(client.id)).rejects.toThrow(
        'Refresh Token has expired'
      )
    })

    it('should throw if client returns null', async () => {
      ;(DynamoManager as jest.Mock).mockImplementation(function() {
        // @ts-ignore
        this.read = () => Promise.resolve(null)
      })

      const jwtManager = new JwtManager()

      await expect(jwtManager.getClient('MOCK_REFRESH_TOKEN')).rejects.toThrow(
        'Refresh Token is not valid'
      )
    })

    it('should throw if client returns null Item', async () => {
      ;(DynamoManager as jest.Mock).mockImplementation(function() {
        // @ts-ignore
        this.read = () => Promise.resolve({ Item: null })
      })

      const jwtManager = new JwtManager()

      await expect(jwtManager.getClient('MOCK_REFRESH_TOKEN')).rejects.toThrow(
        'Refresh Token is not valid'
      )
    })
  })
})
