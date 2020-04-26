import {
  File,
  ModelFileConnection,
  MutationCreateFileArgs,
  MutationDeleteFileArgs,
  MutationUpdateFileArgs,
  Node,
  QueryListFilesArgs,
  QueryReadFileArgs,
  QueryReadTreeArgs,
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
  async readTree(
    _: any,
    { repo, username }: QueryReadTreeArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<Node> {
    return fileManager.readTree(username, repo)
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
