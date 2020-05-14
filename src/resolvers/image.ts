import {
  File,
  MutationCreateImageArgs,
  MutationDeleteImageArgs,
  MutationUpdateImageArgs,
  QueryReadImageArgs,
} from '../resolvers-types'

import { IContext } from '../server'

export const ImageQueries = {
  async readImage(
    _: any,
    { path }: QueryReadImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.readFile(path)
  },
}

export const ImageMutations = {
  async createImage(
    _: any,
    { input: { path, content } }: MutationCreateImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.createFile(path, content)
  },
  async updateImage(
    _: any,
    { input }: MutationUpdateImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.updateFile(input)
  },
  async deleteImage(
    _: any,
    { input: { path } }: MutationDeleteImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.deleteFile(path)
  },
}
