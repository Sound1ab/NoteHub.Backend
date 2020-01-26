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
    _: any,
    { username, repo }: QueryReadRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.readRepo(username, repo)
  },
  async listRepos(
    _0: any,
    _1: any,
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
    _: any,
    { input }: MutationCreateRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.createRepo(input.name, input.description, input.private)
  },
  async updateRepo(
    _: any,
    { input }: MutationUpdateRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.updateRepo(input)
  },
  async deleteRepo(
    _: any,
    { input }: MutationDeleteRepoArgs,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.deleteRepo(input.username, input.repo)
  },
}
