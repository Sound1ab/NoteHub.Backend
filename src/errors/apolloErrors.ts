import { APOLLO_ERRORS } from './extensionCodes'
import { GraphQLError } from 'graphql'

// This Class has been copied from apollo-server-errors to remove
// transpiling issues in ts-jest
export class ApolloError extends Error implements GraphQLError {
  public extensions: Record<string, any>
  public readonly name: any
  public readonly locations: any
  public readonly path: any
  public readonly source: any
  public readonly positions: any
  public readonly nodes: any
  public originalError: any;

  [key: string]: any

  constructor(
    message: string,
    code?: string,
    extensions?: Record<string, any>
  ) {
    super(message)

    if (extensions) {
      Object.keys(extensions)
        .filter(keyName => keyName !== 'message' && keyName !== 'extensions')
        .forEach(key => {
          this[key] = extensions[key]
        })
    }

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ApolloError' })
    }

    const userProvidedExtensions = (extensions && extensions.extensions) || null

    this.extensions = { ...extensions, ...userProvidedExtensions, code }
  }
}

export class JwtMissingError extends ApolloError {
  constructor() {
    super('JWT missing', APOLLO_ERRORS.JWT_MISSING)

    Object.defineProperty(this, 'name', { value: 'JwtMissing' })
  }
}

export class JwtExpiredError extends ApolloError {
  constructor() {
    super('JWT has expired', APOLLO_ERRORS.JWT_EXPIRED)

    Object.defineProperty(this, 'name', { value: 'JwtExpired' })
  }
}

export class JwtSignatureMismatchError extends ApolloError {
  constructor() {
    super('JWT signature mismatch', APOLLO_ERRORS.JWT_SIGNATURE_MISMATCH)

    Object.defineProperty(this, 'name', { value: 'JwtSignatureMismatch' })
  }
}

export class RefreshTokenExpiredError extends ApolloError {
  constructor() {
    super('Refresh Token has expired', APOLLO_ERRORS.REFRESH_TOKEN_EXPIRED)

    Object.defineProperty(this, 'name', { value: 'RefreshTokenExpired' })
  }
}

export class RefreshTokenNotValidError extends ApolloError {
  constructor() {
    super('Refresh Token is not valid', APOLLO_ERRORS.REFRESH_TOKEN_NOT_VALID)

    Object.defineProperty(this, 'name', { value: 'RefreshTokenNotValid' })
  }
}

export class ConfigurationNotFoundError extends ApolloError {
  constructor() {
    super('Configuration not found', APOLLO_ERRORS.CONFIGURATION_NOT_FOUND)

    Object.defineProperty(this, 'name', { value: 'ConfigurationNotFound' })
  }
}

export class UpdateError extends ApolloError {
  constructor() {
    super('Update error', APOLLO_ERRORS.UPDATE_ERROR)

    Object.defineProperty(this, 'name', { value: 'UpdateError' })
  }
}
