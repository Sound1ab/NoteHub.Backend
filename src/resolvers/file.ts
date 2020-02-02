import {
  File,
  ModelFileConnection,
  MutationCreateFileArgs,
  MutationDeleteFileArgs,
  MutationUpdateFileArgs,
  QueryListFilesArgs,
  QueryReadCommitArgs,
  QueryReadFileArgs,
} from '../resolvers-types'

import { IContext } from '../server'

export const FileQueries = {
  async readFile(
    _: any,
    { filename, repo, username }: QueryReadFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.readFile(username, repo, filename)
  },
  async listFiles(
    _: any,
    { repo, username }: QueryListFilesArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<ModelFileConnection> {
    const files = await fileManager.listFiles(username, repo)
    // Todo: Move into markdown specific resolver
    return {
      items: files.filter(file => file.filename.includes('.md')),
    }
  },
  async readCommit(
    _: any,
    { repo, username, filename }: QueryReadCommitArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<string> {
    const files = await fileManager.readCommit(username, repo, filename)
    return files
  },
}

export const FileMutations = {
  async createFile(
    _: any,
    { input: { username, repo, filename, content } }: MutationCreateFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.createFile(username, repo, filename, content)
  },
  async updateFile(
    _: any,
    { input }: MutationUpdateFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.updateFile(input)
  },
  async deleteFile(
    _: any,
    { input: { filename, repo, username } }: MutationDeleteFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.deleteFile(username, repo, filename)
  },
}
