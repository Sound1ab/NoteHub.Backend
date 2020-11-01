import {
  File,
  MutationCreateImageArgs,
  MutationDeleteImageArgs,
  MutationUpdateImageArgs,
  QueryReadImageArgs,
} from '../resolvers-types'
import { FileManager, S3Manager } from '../services'

import { IContext } from '../server'

export const ImageQueries = {
  async readImage(
    _: any,
    { path }: QueryReadImageArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.readFile(path)
  },
}

export const ImageMutations = {
  async createImage(
    _: any,
    { input: { path, content } }: MutationCreateImageArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.createFile(path, content, true)
  },
  async updateImage(
    _: any,
    { input }: MutationUpdateImageArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.updateFile(input)
  },
  async deleteImage(
    _: any,
    { input: { path } }: MutationDeleteImageArgs,
    context: IContext
  ): Promise<File> {
    const fileManager = new FileManager(context)

    return fileManager.deleteFile(path)
  },
  async createSignedUrl(): Promise<string> {
    const bucket = process.env.S3_IMAGE_BUCKET

    if (!bucket) {
      throw new Error('No bucket set')
    }

    const s3Manager = new S3Manager(bucket)

    return s3Manager.createSignedUrl()
  },
}
