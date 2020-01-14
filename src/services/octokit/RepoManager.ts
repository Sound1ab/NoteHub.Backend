import { Repo, UpdateRepoInput } from '../../resolvers-types'

import { Github } from './Base'
import Octokit from '@octokit/rest'

export class RepoManager extends Github {
  public async readRepo(owner: string, repo: string): Promise<Repo> {
    const { data } = await this.octokit.repos.get({
      owner,
      repo: `${this.repoNamespace}${repo}`,
    })
    return this.formatRepoResult(data)
  }

  public async listRepos(): Promise<Repo[]> {
    let result
    try {
      const { data } = await this.octokit.repos.list({
        affiliation: 'owner',
        per_page: 100,
      })
      result = data
    } catch (error) {
      if (error.message === 'Bad credentials') {
        throw error
      }
      result = []
    }
    return result
      .filter((repo: Octokit.AnyResponse['data']) =>
        repo.name.includes(this.repoNamespace)
      )
      .map((repo: Octokit.AnyResponse['data']) => this.formatRepoResult(repo))
  }

  public async createRepo(
    name: string,
    description?: string | null,
    privateRepo?: boolean | null
  ): Promise<Repo> {
    const { data } = await this.octokit.repos.createForAuthenticatedUser({
      description: description || '',
      name: `${this.repoNamespace}${name}`,
      private: privateRepo ? privateRepo : undefined,
    })
    return this.formatRepoResult(data)
  }

  public async updateRepo({
    description: updatedDescription,
    repo,
    username,
    private: updatedPrivate,
  }: UpdateRepoInput): Promise<Repo> {
    const { description, private: isPrivate } = await this.readRepo(
      username,
      repo
    )
    const { data } = await this.octokit.repos.update({
      description: updatedDescription || description || '',
      owner: username,
      private: updatedPrivate ?? isPrivate,
      repo: `${this.repoNamespace}${repo}`,
    })
    return this.formatRepoResult(data)
  }

  public async deleteRepo(owner: string, repo: string): Promise<Repo> {
    const originalRepo = await this.readRepo(owner, repo)
    await this.octokit.repos.delete({
      owner,
      repo: `${this.repoNamespace}${repo}`,
    })
    return originalRepo
  }

  private formatRepoResult(
    repo:
      | Octokit.ReposUpdateResponse
      | Octokit.ReposCreateForAuthenticatedUserResponse
  ): Repo {
    return {
      ...repo,
      name: this.removeNamespace(repo.name),
    }
  }

  private removeNamespace(str: string) {
    return str.replace(new RegExp(this.repoNamespace, 'gi'), '')
  }
}
