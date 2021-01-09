export function extractJwtFromAuth(bearerToken: string) {
  return bearerToken ? bearerToken.substring(7, bearerToken.length) : null
}
