import { MutationUpdateRepoArgs, Repo } from '../resolvers-types'

import { IContext } from '../server'
import { RepoManager } from '../services'

export const RepoQueries = {
  async readRepo(_: any, _1: any, context: IContext): Promise<Repo> {
    const repoManager = new RepoManager(context)

    return repoManager.readRepo()
  },
}

export const RepoMutations = {
  async createRepo(_: any, _1: any, context: IContext): Promise<Repo> {
    const repoManager = new RepoManager(context)

    return repoManager.createRepo()
  },
  async updateRepo(
    _: any,
    { input }: MutationUpdateRepoArgs,
    context: IContext
  ): Promise<Repo> {
    const repoManager = new RepoManager(context)

    return repoManager.updateRepo(input)
  },
  async deleteRepo(_: any, _1: any, context: IContext): Promise<Repo> {
    const repoManager = new RepoManager(context)

    return repoManager.deleteRepo()
  },
}
