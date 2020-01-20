import {
  File,
  ModelFileConnection,
  MutationCreateImageArgs,
  MutationDeleteImageArgs,
  MutationUpdateImageArgs,
  QueryListImagesArgs,
  QueryReadImageArgs,
} from '../resolvers-types'

import { FileManager } from '../services'
import { IContext } from '../server'

export const ImageQueries = {
  async readImage(
    _,
    { filename, repo, username }: QueryReadImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.readFile(username, repo, `images/${filename}`)
  },
  async listImages(
    _,
    { repo, username }: QueryListImagesArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<ModelFileConnection> {
    const files = await fileManager.listFiles(username, repo, '/images')
    return {
      items: files,
    }
  },
}

export const ImageMutations = {
  async createImage(
    _,
    { input: { username, repo, filename, content } }: MutationCreateImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.createFile(username, repo, `images/${filename}`, content)
  },
  async updateImage(
    _,
    { input }: MutationUpdateImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.updateFile(input)
  },
  async deleteImage(
    _,
    { input: { filename, repo, username } }: MutationDeleteImageArgs,
    { dataSources: { fileManager } }: IContext
  ): Promise<File> {
    return fileManager.deleteFile(username, repo, `images/${filename}`)
  },
}
