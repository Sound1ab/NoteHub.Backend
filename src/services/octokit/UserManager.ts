import axios from 'axios'
import { Github } from './Base'

const GITHUB_ACCESS_TOKEN_LINK = process.env.SERVERLESS_APP_GITHUB_ACCESS_TOKEN_LINK
const CLIENT_SECRET = process.env.SERVERLESS_APP_CLIENT_SECRET
const CLIENT_ID = process.env.SERVERLESS_APP_CLIENT_ID
const REDIRECT_URL = process.env.SERVERLESS_APP_REDIRECT_URL

export class UserManager extends Github {
  public async readGithubUserAccessToken(code: string, state: string) {
    const { data } = await axios.post(GITHUB_ACCESS_TOKEN_LINK as string, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URL,
      state,
    })

    console.log('data', data)

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
