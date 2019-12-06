type envConstants =
  | 'SERVERLESS_APP_GITHUB_ACCESS_TOKEN_LINK'
  | 'SERVERLESS_APP_CLIENT_SECRET'
  | 'SERVERLESS_APP_CLIENT_ID'
  | 'SERVERLESS_APP_REDIRECT_URL'
  | 'SERVERLESS_APP_REDIRECT_URL_LOCAL'

export function getEnv(env: envConstants) {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  return process.env.NODE_ENV === 'development'
    ? process.env[`${env}_DEV`]
    : process.env[env]
}
