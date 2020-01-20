import {
  ModelRepoConnection,
  MutationCreateRepoArgs,
  MutationDeleteRepoArgs,
  MutationUpdateRepoArgs,
  QueryReadRepoArgs,
  Repo,
} from '../resolvers-types'

import { IContext } from '../server'

export const RepoQueries = {
  async readRepo(
    _,
    { username, repo }: QueryReadRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.readRepo(username, repo)
  },
  async listRepos(
    _1,
    _2,
    { dataSources: { repoManager } }: IContext
  ): Promise<ModelRepoConnection> {
    const repos = await repoManager.listRepos()
    return {
      items: repos,
    }
  },
}

export const RepoMutations = {
  async createRepo(
    _,
    { input }: MutationCreateRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.createRepo(input.name, input.description, input.private)
  },
  async updateRepo(
    _,
    { input }: MutationUpdateRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.updateRepo(input)
  },
  async deleteRepo(
    _,
    { input }: MutationDeleteRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.deleteRepo(input.username, input.repo)
  },
}
