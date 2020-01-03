import Throttle from '@octokit/plugin-throttling'
import Octokit from '@octokit/rest'

const octokitWithThrottle = Octokit.plugin(Throttle)

export class Github {
  public static encodeToBase64(str: string) {
    return Buffer.from(str, 'binary').toString('base64')
  }

  public static decodeFromBase64(str: string) {
    return Buffer.from(str, 'base64').toString('ascii')
  }

  public static formCommitMessage(
    name: string,
    operation: 'create' | 'update' | 'delete'
  ) {
    return `note(${operation} file): ${name} - ${new Date().toDateString()}`
  }

  public octokit: Octokit
  public repoNamespace = 'Soft.'
  private userAgent = 'noted-api-v1'

  public constructor(token?: string, log?: boolean) {
    this.octokit = new octokitWithThrottle({
      auth: `token ${token}`,
      log: log ? console : {},
      throttle: {
        onAbuseLimit: (retryAfter: any, options: any) => {
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
}
