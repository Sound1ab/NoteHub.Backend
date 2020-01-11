import {
  File,
  ModelFileConnection,
  MutationCreateFileArgs,
  MutationDeleteFileArgs,
  MutationUpdateFileArgs,
  QueryListFilesArgs,
  QueryReadFileArgs,
} from '../resolvers-types'
import { FileManager } from '../services/octokit'

export const FileQueries = {
  async readFile(
    _,
    { filename, repo, username }: QueryReadFileArgs,
    { fileManager }: { fileManager: FileManager }
  ): Promise<File> {
    return fileManager.readFile(username, repo, filename)
  },
  async listFiles(
    _,
    { repo, username }: QueryListFilesArgs,
    { fileManager }: { fileManager: FileManager }
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
    { fileManager }: { fileManager: FileManager }
  ): Promise<File> {
    return fileManager.createFile(username, repo, filename, content)
  },
  async updateFile(
    _,
    { input }: MutationUpdateFileArgs,
    { fileManager }: { fileManager: FileManager }
  ): Promise<File> {
    return fileManager.updateFile(input)
  },
  async deleteFile(
    _,
    { input: { filename, repo, username } }: MutationDeleteFileArgs,
    { fileManager }: { fileManager: FileManager }
  ): Promise<File> {
    return fileManager.deleteFile(username, repo, filename)
  },
}
