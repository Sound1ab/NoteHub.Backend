import { DataSourceConfig } from 'apollo-datasource/src/index'
import { GraphQLClient } from 'graphql-request'
import { IContext } from '../../server'
import { JwtManager } from '..'
import Octokit from '@octokit/rest'
// @ts-ignore
import Throttle from '@octokit/plugin-throttling'
import { decrypt } from '../../utils'

const octokitWithThrottle = Octokit.plugin(Throttle)

const jwtManager = new JwtManager()

export class Github {
  public static encodeToBase64(str?: string | null) {
    if (!str) {
      return ''
    }
    return Buffer.from(str).toString('base64')
  }

  public static encodeImageToBase64(str?: string | null) {
    if (!str) {
      return ''
    }
    return Buffer.from(str, 'binary').toString('base64')
  }

  public static decodeFromBase64(str: string) {
    // return Buffer.from(str, 'base64').toString('ascii')
    return Buffer.from(str, 'base64').toString()
  }

  public static formCommitMessage(
    name: string,
    operation: 'create' | 'update' | 'delete'
  ) {
    return `note(${operation} file): ${name} - ${new Date().toDateString()}`
  }

  public octokit: Octokit
  public graphql: GraphQLClient
  public repo = 'NoteHub.Notebook'
  public owner: string
  private userAgent = 'noted-api-v1'

  // Config is passed by Apollo when added as a DataSource in Apollo Server
  public initialize({
    context: { jwt, owner },
  }: DataSourceConfig<IContext>): void {
    const accessToken = this.getAccessToken(jwt)

    this.octokit = this.initOctokit(accessToken)
    this.graphql = this.initGraphQL(accessToken)

    this.owner = owner ?? ''
  }

  public initOctokitWithAccessToken(accessToken: string): this {
    this.octokit = this.initOctokit(accessToken)
    return this
  }

  private initGraphQL(accessToken: string) {
    const endpoint = 'https://api.github.com/graphql'

    return new GraphQLClient(endpoint, {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    })
  }

  private initOctokit(accessToken: string) {
    return new octokitWithThrottle({
      auth: `token ${accessToken}`,
      throttle: {
        onAbuseLimit: (_: any, options: any) => {
          // does not retry, only logs a warning
          this.octokit.log.warn(
            `Abuse detected for request ${options.method} ${options.url}`
          )
        },
        onRateLimit: (retryAfter: any, options: any) => {
          this.octokit.log.warn(
            `Request quota exhausted for request ${options.method} ${options.url}`
          )

          if (options.request.retryCount === 0) {
            // only retries once
            console.log(`Retrying after ${retryAfter} seconds!`)
            return true
          }
        },
      },
      userAgent: this.userAgent,
    })
  }

  private getAccessToken(jwt: string | null) {
    if (!jwt) {
      return ''
    }

    const {
      body: { accessToken: encryptedAccessToken, iv },
    } = jwtManager.getJwtValues(jwt)

    return decrypt(encryptedAccessToken, iv)
  }
}
