import { Response } from 'node-fetch'
import { exposeHeaders } from './exposeHeaders'

export function filterResponseHeaders(response: Response) {
  const responseHeaders: Record<string, any> = {}

  for (const headername of exposeHeaders) {
    if (headername === 'content-length') continue
    if (response.headers.has(headername)) {
      responseHeaders[headername] = response.headers.get(headername)
    }
  }

  return responseHeaders
}