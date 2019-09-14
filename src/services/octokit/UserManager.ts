import axios from 'axios'
import { Github } from './Base'

const GITHUB_ACCESS_TOKEN_LINK = process.env.GITHUB_ACCESS_TOKEN_LINK as string
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CLIENT_ID = process.env.CLIENT_ID
const REDIRECT_URL = process.env.REDIRECT_URL

console.log('github', GITHUB_ACCESS_TOKEN_LINK)
console.log('CLIENT_SECRET', CLIENT_SECRET)
console.log('CLIENT_ID', CLIENT_ID)
console.log('REDIRECT_URL', REDIRECT_URL)


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
