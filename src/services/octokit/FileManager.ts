import {
  File,
  ModelNodeConnection,
  MoveFileInput,
  Node_Type,
  UpdateFileInput,
} from '../../resolvers-types'

import { GetCommit } from '../../queries/GetCommit'
import { GitCreateTreeResponseTreeItem } from '@octokit/rest'
import { Github } from './Base'
import { VFileCompatible } from 'vfile'

export class FileManager extends Github {
  public async readFile(path: string): Promise<File> {
    const { data } = await this.octokit.repos.getContents({
      owner: this.owner,
      path,
      repo: this.repo,
    })

    if (data.type === 'file') {
      const content = Github.decodeFromBase64(data.content)

      let messages: VFileCompatible[] = []

      if (this.retext) {
        messages = await this.retext.processMarkdownTree(content)
      }

      return {
        ...data,
        content,
        excerpt: `${content.substring(0, 50)}...`,
        filename: data.name,
        messages: {
          nodes: messages,
        },
        readAt: Date.now().toString(),
        type: Node_Type.File,
      }
    }

    return {
      ...data,
      filename: data.name,
      type: Node_Type.Folder,
    }
  }

  public async readNodes(): Promise<ModelNodeConnection> {
    try {
      const {
        repository: {
          object: {
            history: {
              nodes: [{ oid }],
            },
          },
        },
      } = await this.graphql.request(GetCommit, {
        name: this.repo,
        owner: this.owner,
      })

      const {
        data: { tree },
      } = await this.octokit.git.getTree({
        owner: this.owner,
        recursive: 1,
        repo: this.repo,
        tree_sha: oid,
      })

      return {
        nodes: tree
          .filter((node: GitCreateTreeResponseTreeItem) => {
            return !node.path.includes('__notehub__images__')
          })
          .map((node: GitCreateTreeResponseTreeItem) => {
            return {
              ...node,
              type: node.type === 'blob' ? Node_Type.File : Node_Type.Folder,
            }
          }),
      }
    } catch (error) {
      // Repo has been setup but no changes have been made to it
      if (error.message === "Cannot read property 'history' of null") {
        return {
          nodes: [],
        }
      }

      // All files within the repo have been deleted
      if (error.message === 'Not Found') {
        return {
          nodes: [],
        }
      }

      throw new Error(error)
    }
  }

  public async createFile(
    path: string,
    content?: string | null,
    isImage: boolean = false
  ): Promise<File> {
    try {
      const file = await this.readFile(path)
      if (file.sha) {
        throw new Error('file already exists')
      }
    } catch (error) {
      // We want to swallow these error messages and throw
      // everything else
      if (
        !error.message.includes('This repository is empty.') &&
        !error.message.includes('Not Found')
      ) {
        throw error
      }
    }

    try {
      await this.octokit.repos.createFile({
        content: isImage
          ? Github.encodeImageToBase64(content)
          : Github.encodeToBase64(content),
        message: Github.formCommitMessage(path, 'create'),
        owner: this.owner,
        path,
        repo: this.repo,
      })
    } catch (error) {
      if (!error.message.includes('"sha" wasn\'t supplied')) {
        throw error
      }
    }
    return this.readFile(path)
  }

  public async updateFile({ path, content }: UpdateFileInput): Promise<File> {
    const { sha, content: originalContent } = await this.readFile(path)

    await this.octokit.repos.updateFile({
      content: Github.encodeToBase64(content ?? originalContent ?? ''),
      message: Github.formCommitMessage(path, 'update'),
      owner: this.owner,
      path,
      repo: this.repo,
      sha,
    })

    return this.readFile(path)
  }

  public async deleteFile(path: string): Promise<File> {
    const file = await this.readFile(path)
    await this.octokit.repos.deleteFile({
      message: Github.formCommitMessage(path, 'delete'),
      owner: this.owner,
      path,
      repo: this.repo,
      sha: file.sha,
    })
    return file
  }

  public async moveFile({ path, newPath }: MoveFileInput): Promise<File> {
    const { content } = await this.readFile(path)

    await this.deleteFile(path)

    return this.createFile(newPath, content)
  }
}
