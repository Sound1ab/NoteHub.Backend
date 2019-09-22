import {
  ModelRepoConnection,
  MutationCreateRepoArgs,
  MutationDeleteRepoArgs,
  MutationUpdateRepoArgs,
  QueryReadRepoArgs,
  Repo,
} from '../resolvers-types'
import { RepoManager } from '../services/octokit'

export function RepoQueries() {
  return {
    async readRepo(
      _,
      { username, repo }: QueryReadRepoArgs,
      { repoManager }: { repoManager: RepoManager }
    ): Promise<Repo> {
      return repoManager.readRepo(username, repo)
    },
    async listRepos(
      _1,
      _2,
      { repoManager }: { repoManager: RepoManager }
    ): Promise<ModelRepoConnection> {
      const repos = await repoManager.listRepos()
      return {
        items: repos,
      }
    },
  }
}

export function RepoMutations() {
  return {
    async createRepo(
      _,
      { input }: MutationCreateRepoArgs,
      { repoManager }: { repoManager: RepoManager }
    ): Promise<Repo> {
      return repoManager.createRepo(input.name, input.description, input.private)
    },
    async updateRepo(
      _,
      { input }: MutationUpdateRepoArgs,
      { repoManager }: { repoManager: RepoManager }
    ): Promise<Repo> {
      return repoManager.updateRepo(
        input.username,
        input.repo,
        input.name,
        input.description,
      )
    },
    async deleteRepo(
      _,
      { input }: MutationDeleteRepoArgs,
      { repoManager }: { repoManager: RepoManager }
    ): Promise<Repo> {
      return repoManager.deleteRepo(input.username, input.repo)
    },
  }
}
