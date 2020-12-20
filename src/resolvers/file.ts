import {
  File,
  MutationCreateFileArgs,
  MutationDeleteFileArgs,
  MutationMoveFileArgs,
  MutationUpdateFileArgs,
  QueryReadFileArgs,
} from '../resolvers-types'

import { FileManager } from '../services'
import { IContext } from '../server'

export const FileQueries = {
  async readFile(
    _: any,
    { path }: QueryReadFileArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.readFile(path)
  },
  async readFiles(_: any, _1: any, context: IContext): Promise<File[]> {
    const fileManager = new FileManager(context)

    return fileManager.readFiles()
  },
}

export const FileMutations = {
  async createFile(
    _: any,
    { input: { path, content } }: MutationCreateFileArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.createFile(path, content)
  },
  async updateFile(
    _: any,
    { input: { path, content } }: MutationUpdateFileArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.updateFile({ path, content })
  },
  async deleteFile(
    _: any,
    { input: { path } }: MutationDeleteFileArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.deleteFile(path)
  },
  async moveFile(
    _: any,
    { input }: MutationMoveFileArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.moveFile(input)
  },
}
