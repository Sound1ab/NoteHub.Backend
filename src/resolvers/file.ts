import {
  File,
  ModelNodeConnection,
  MutationCreateFileArgs,
  MutationDeleteFileArgs,
  MutationMoveFileArgs,
  MutationUpdateFileArgs,
  QueryReadFileArgs,
} from '../resolvers-types'

import { FileManager } from '../services'
import { IContext } from '../server'
import { Retext } from '../services/retext/Retext'

export const FileQueries = {
  async readFile(
    _: any,
    { path }: QueryReadFileArgs,
    context: IContext
  ): Promise<File> {
    const retext = new Retext()
    const fileManager = new FileManager(context, retext)

    return fileManager.readFile(path)
  },
  async readNodes(
    _: any,
    _1: any,
    context: IContext
  ): Promise<ModelNodeConnection> {
    const fileManager = new FileManager(context)

    return fileManager.readNodes()
  },
}

export const FileMutations = {
  async createFile(
    _: any,
    { input: { path, content } }: MutationCreateFileArgs,
    context: IContext
  ): Promise<File> {
    const retext = new Retext()
    const fileManager = new FileManager(context, retext)

    return fileManager.createFile(path, content)
  },
  async updateFile(
    _: any,
    { input }: MutationUpdateFileArgs,
    context: IContext
  ): Promise<File> {
    const retext = new Retext()
    const fileManager = new FileManager(context, retext)

    return fileManager.updateFile(input)
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
