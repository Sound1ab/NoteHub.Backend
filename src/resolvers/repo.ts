import {
  ModelRepoConnection,
  MutationCreateRepoArgs,
  MutationDeleteRepoArgs,
  MutationUpdateRepoArgs,
  QueryListReposArgs,
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
      _,
      { username }: QueryListReposArgs,
      { repoManager }: { repoManager: RepoManager }
    ): Promise<ModelRepoConnection> {
      const repos = await repoManager.listRepos(username)
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
      return repoManager.createRepo(input.name, input.description)
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
        input.description
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
