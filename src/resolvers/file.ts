import {
  File,
  ModelFileConnection,
  MutationCreateFileArgs,
  MutationDeleteFileArgs,
  MutationUpdateFileArgs,
  QueryListFilesArgs,
  QueryReadFileArgs,
} from '../resolvers-types'

import { IContext } from '../server'

export const FileQueries = {
  async readFile(
    _,
    { filename, repo, username }: QueryReadFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.readFile(username, repo, filename)
  },
  async listFiles(
    _,
    { repo, username }: QueryListFilesArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<ModelFileConnection> {
    const files = await fileManager.listFiles(username, repo)
    // Todo: Move into markdown specific resolver
    return {
      items: files.filter(file => file.filename.includes('.md')),
    }
  },
}

export const FileMutations = {
  async createFile(
    _,
    { input: { username, repo, filename, content } }: MutationCreateFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.createFile(username, repo, filename, content)
  },
  async updateFile(
    _,
    { input }: MutationUpdateFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.updateFile(input)
  },
  async deleteFile(
    _,
    { input: { filename, repo, username } }: MutationDeleteFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.deleteFile(username, repo, filename)
  },
}
