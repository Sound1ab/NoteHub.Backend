import { AuthenticationError } from 'apollo-server-lambda'
import Cookie from 'cookie'

export const createCookie = (name: string, value: string) => {
  return Cookie.serialize(name, value, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export const addCookie = (context: any, name: string, value: string) => {
  const cookie = createCookie(name, value)

  context.addHeaders = [{ key: 'Set-Cookie', value: cookie }]
}

export const removeCookie = (context: any, name: string) => {
  const cookie = Cookie.serialize(name, '', {
    expires: new Date('August 19, 1975 23:15:30'),
    httpOnly: true,
  })

  context.addHeaders = [{ key: 'Set-Cookie', value: cookie }]
}

export const parseRefreshTokenFromCookie = (cookie?: string) => {
  if (!cookie) {
    throw new Error('No cookie present')
  }

  const parsedCookie = Cookie.parse(cookie)

  if (!parsedCookie.refreshToken) {
    throw new AuthenticationError('No refreshToken')
  }

  return parsedCookie.refreshToken
}
