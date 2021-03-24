import createHttpError from 'http-errors'
import { extractJwtFromAuth } from './extractJwtFromAuth'
import { lowerCaseObjectProps } from './lowerCaseObjectProps'
import { verifyJwtAndGetUserDetails } from './verifyJwtAndGetUserDetails'

export async function replaceAuthorizationHeader(
  headers: Record<string, string>
) {
  // Lowercase request headers to match allowHeaders
  const { authorization, cookie, ...rest } = lowerCaseObjectProps(headers)

  const jwt = extractJwtFromAuth(authorization)

  let accessToken: string | null

  try {
    accessToken = jwt ? verifyJwtAndGetUserDetails(jwt).accessToken : null
  } catch (err) {
    throw new createHttpError.Unauthorized()
  }

  return {
    ...rest,
    ...(accessToken
      ? {
          Authorization: `Basic ${Buffer.from(accessToken).toString('base64')}`,
        }
      : undefined),
  }
}
