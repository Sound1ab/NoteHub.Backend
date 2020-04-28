import {
  File,
  ModelFileConnection,
  ModelNodeConnection,
  MutationCreateFileArgs,
  MutationDeleteFileArgs,
  MutationUpdateFileArgs,
  QueryReadFileArgs,
} from '../resolvers-types'

import { IContext } from '../server'

export const FileQueries = {
  async readFile(
    _: any,
    { path }: QueryReadFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.readFile(path)
  },
  async readTree(
    _: any,
    _1: any,
    { dataSources: { fileManager } }: IContext
  ): Promise<ModelNodeConnection> {
    return fileManager.readTree()
  },
}

export const FileMutations = {
  async createFile(
    _: any,
    { input: { path, content } }: MutationCreateFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.createFile(path, content)
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
    { input: { path } }: MutationDeleteFileArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.deleteFile(path)
  },
}
