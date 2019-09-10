import { AuthenticationError } from 'apollo-server-express'

export const ERRORS = {
  AUTHENTICATION_ERROR: new AuthenticationError(
    'You must be authorized to access this schema'
  ),
}
