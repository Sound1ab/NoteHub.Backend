import { extractJwtFromAuth } from './extractJwtFromAuth'
import { lowerCaseObjectProps } from './lowerCaseObjectProps'
import { verifyJwtAndGetUserDetails } from './verifyJwtAndGetUserDetails'

export function replaceAuthorizationHeader(headers: Record<string, string>) {
  // Lowercase request headers to match allowHeaders
  const { authorization, ...rest } = lowerCaseObjectProps(headers)

  const jwt = extractJwtFromAuth(authorization)

  try {
    const accessToken = jwt ? verifyJwtAndGetUserDetails(jwt).accessToken : null

    return {
      ...rest,
      ...(accessToken
        ? {
            Authorization: `Basic ${Buffer.from(accessToken).toString(
              'base64'
            )}`,
          }
        : undefined),
    }
  } catch {
    return rest
  }
}
