import { Repo, UpdateRepoInput } from '../../resolvers-types'

import { Github } from './Base'

export class RepoManager extends Github {
  public async readRepo(name: string): Promise<Repo> {
    const { data } = await this.octokit.repos.get({
      owner: this.owner,
      repo: name,
    })
    return data
  }

  public async listRepos(): Promise<Repo[]> {
    const { data } = await this.octokit.repos.list({
      per_page: 100,
      sort: 'updated',
    })
    return data
  }

  public async createRepo(): Promise<Repo> {
    const { data } = await this.octokit.repos.createForAuthenticatedUser({
      description: 'A place to keep all notes created by Notehub',
      name: this.repo,
      private: false,
    })
    return data
  }

  public async updateRepo({
    name,
    description: updatedDescription,
    private: updatedPrivate,
  }: UpdateRepoInput): Promise<Repo> {
    const { description, private: isPrivate } = await this.readRepo(name)
    const { data } = await this.octokit.repos.update({
      description: updatedDescription || description || '',
      owner: this.owner,
      private: updatedPrivate ?? isPrivate,
      repo: this.repo,
    })
    return data
  }

  public async deleteRepo(name: string): Promise<Repo> {
    const originalRepo = await this.readRepo(name)
    await this.octokit.repos.delete({
      owner: this.owner,
      repo: name,
    })
    return originalRepo
  }
}
