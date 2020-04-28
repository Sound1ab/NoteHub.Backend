import {
  File,
  ModelNodeConnection,
  UpdateFileInput,
} from '../../resolvers-types'

import { GetCommit } from '../../queries/GetCommit'
import { Github } from './Base'
import Octokit from '@octokit/rest'
import { createTreeBeard } from '../../utils/tree'

export class FileManager extends Github {
  private readme = 'README.md'

  public async readFile(path: string): Promise<File> {
    const { data } = await this.octokit.repos.getContents({
      owner: this.owner,
      path,
      repo: this.repo,
    })
    const content = Github.decodeFromBase64(data.content)
    return {
      ...data,
      content,
      excerpt: `${content.substring(0, 50)}...`,
      filename: data.name,
      repo: this.repo,
    }
  }

  public async listFiles(): Promise<File[]> {
    try {
      const { data } = await this.octokit.repos.getContents({
        owner: this.owner,
        path: '/',
        repo: this.repo,
      })
      // Files have been previously added but all have been deleted
      if (data.length === 0) {
        const file = await this.createFile(this.readme, '')
        return [{ ...file, repo: this.repo }]
      }
      return data.map((file: Octokit.AnyResponse['data']) => ({
        ...file,
        filename: file.name,
        repo: this.repo,
      }))
    } catch (error) {
      // First time creating a repo and no new files have been added yet
      if (error.message === 'This repository is empty.') {
        const file = await this.createFile(this.readme, `# ${this.repo}`)
        return [{ ...file, repo: this.repo }]
      }
      if (
        error.message === 'Not Found' ||
        error.message === 'Bad credentials'
      ) {
        throw error
      }
      return []
    }
  }

  public async createFile(
    path: string,
    content?: string | null
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
        content: content ? Github.encodeToBase64(content) : '',
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
    return { ...file, repo: this.repo }
  }

  public async readTree(): Promise<ModelNodeConnection> {
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

    const treeBeard = createTreeBeard(tree)

    if (!treeBeard.children) {
      throw new Error('treebeard root does not have child')
    }

    return {
      nodes: treeBeard.children,
    }
  }
}
