import { JwtManager } from '../services'
import { decrypt } from '../utils'

const jwtManager = new JwtManager()

export function verifyJwtAndGetUserDetails(jwt: string | null) {
  if (!jwt) {
    return {
      accessToken: '',
      owner: '',
    }
  }

  const {
    body: { accessToken: encryptedAccessToken, iv, login },
  } = jwtManager.getJwtValues(jwt)

  return { accessToken: decrypt(encryptedAccessToken, iv), owner: login }
}
