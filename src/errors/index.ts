import { AuthenticationError } from 'apollo-server-lambda'

export const ERRORS = {
  AUTHENTICATION_ERROR: new AuthenticationError(
    'You must be authorized to access this schema'
  ),
}
