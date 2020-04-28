import { Repo, UpdateRepoInput } from '../../resolvers-types'

import { Github } from './Base'

export class RepoManager extends Github {
  public async readRepo(): Promise<Repo> {
    const { data } = await this.octokit.repos.get({
      owner: this.owner,
      repo: this.repo,
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
    description: updatedDescription,
    private: updatedPrivate,
  }: UpdateRepoInput): Promise<Repo> {
    const { description, private: isPrivate } = await this.readRepo()
    const { data } = await this.octokit.repos.update({
      description: updatedDescription || description || '',
      owner: this.owner,
      private: updatedPrivate ?? isPrivate,
      repo: this.repo,
    })
    return data
  }

  public async deleteRepo(): Promise<Repo> {
    const originalRepo = await this.readRepo()
    await this.octokit.repos.delete({
      owner: this.owner,
      repo: this.repo,
    })
    return originalRepo
  }
}
