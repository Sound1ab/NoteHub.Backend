import {
  ModelRepoConnection,
  MutationUpdateRepoArgs,
  Repo,
} from '../resolvers-types'

import { IContext } from '../server'

export const RepoQueries = {
  async readRepo(
    _: any,
    _1: any,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.readRepo()
  },
}

export const RepoMutations = {
  async createRepo(
    _: any,
    _1: any,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.createRepo()
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
    _1: any,
    { dataSources: { repoManager } }: IContext
  ): Promise<Repo> {
    return repoManager.deleteRepo()
  },
}
