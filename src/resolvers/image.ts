import {
  File,
  ModelFileConnection,
  MutationCreateImageArgs,
  MutationDeleteImageArgs,
  MutationUpdateImageArgs,
  QueryListImagesArgs,
  QueryReadImageArgs,
} from '../resolvers-types'
import { FileManager } from '../services/octokit'

export function ImageQueries() {
  return {
    async readImage(
      _,
      { filename, repo, username }: QueryReadImageArgs,
      { fileManager }: { fileManager: FileManager }
    ): Promise<File> {
      return fileManager.readFile(username, repo, `images/${filename}`)
    },
    async listImages(
      _,
      { repo, username }: QueryListImagesArgs,
      { fileManager }: { fileManager: FileManager }
    ): Promise<ModelFileConnection> {
      const files = await fileManager.listFiles(username, repo, '/images')
      return {
        items: files,
      }
    },
  }
}

export function ImageMutations() {
  return {
    async createImage(
      _,
      { input: { username, repo, filename, content } }: MutationCreateImageArgs,
      { fileManager }: { fileManager: FileManager }
    ): Promise<File> {
      return fileManager.createFile(
        username,
        repo,
        `images/${filename}`,
        content
      )
    },
    async updateImage(
      _,
      { input: { content, filename, repo, username } }: MutationUpdateImageArgs,
      { fileManager }: { fileManager: FileManager }
    ): Promise<File> {
      return fileManager.updateFile(
        username,
        repo,
        `images/${filename}`,
        content
      )
    },
    async deleteImage(
      _,
      { input: { filename, repo, username } }: MutationDeleteImageArgs,
      { fileManager }: { fileManager: FileManager }
    ): Promise<File> {
      return fileManager.deleteFile(username, repo, `images/${filename}`)
    },
  }
}
