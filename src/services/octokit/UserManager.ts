import axios from 'axios'
import { Github } from './Base'

const isDev = process.env.NODE_ENV === 'development'

const GITHUB_ACCESS_TOKEN_LINK = process.env.GITHUB_ACCESS_TOKEN_LINK as string
const CLIENT_SECRET = isDev
  ? process.env.CLIENT_SECRET_DEV
  : process.env.CLIENT_SECRET_PROD
const CLIENT_ID = isDev
  ? process.env.REACT_APP_CLIENT_ID_DEV
  : process.env.REACT_APP_CLIENT_ID_PROD
const REDIRECT_URL = isDev
  ? process.env.REACT_APP_REDIRECT_URL_DEV
  : process.env.REACT_APP_REDIRECT_URL_PROD

export class UserManager extends Github {
  public async readGithubUserAccessToken(code: string, state: string) {
    const { data } = await axios.post(GITHUB_ACCESS_TOKEN_LINK, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URL,
      state,
    })

    const includesAccessToken = data.includes('access_token')

    if (includesAccessToken) {
      return data.replace(/access_token=/gi, '').split('&')[0]
    } else {
      throw new Error('Error retrieving access token')
    }
  }

  public async readUser() {
    const { data } = await this.octokit.users.getAuthenticated()
    return data
  }
}
