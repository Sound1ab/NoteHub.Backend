import { File, Node, UpdateFileInput } from '../../resolvers-types'

import { GetCommit } from '../../queries/GetCommit'
import { Github } from './Base'
import Octokit from '@octokit/rest'
import { createTreeBeard } from '../../utils/tree'

export class FileManager extends Github {
  private readme = 'README.md'

  public async readFile(
    owner: string,
    repo: string,
    name: string
  ): Promise<File> {
    const { data } = await this.octokit.repos.getContents({
      owner,
      path: name,
      repo: `${this.repoNamespace}.${repo}`,
    })
    const content = Github.decodeFromBase64(data.content)
    return {
      ...data,
      content,
      excerpt: `${content.substring(0, 50)}...`,
      filename: data.name,
      repo,
    }
  }

  public async listFiles(
    owner: string,
    repo: string,
    path: string = '/'
  ): Promise<File[]> {
    try {
      const { data } = await this.octokit.repos.getContents({
        owner,
        path,
        repo: `${this.repoNamespace}.${repo}`,
      })
      // Files have been previously added but all have been deleted
      if (data.length === 0) {
        const file = await this.createFile(owner, repo, this.readme, '')
        return [{ ...file, repo }]
      }
      return data.map((file: Octokit.AnyResponse['data']) => ({
        ...file,
        filename: file.name,
        repo,
      }))
    } catch (error) {
      // First time creating a repo and no new files have been added yet
      if (error.message === 'This repository is empty.') {
        const file = await this.createFile(
          owner,
          repo,
          this.readme,
          `# ${repo}`
        )
        return [{ ...file, repo }]
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
    owner: string,
    repo: string,
    name: string,
    content?: string | null
  ): Promise<File> {
    try {
      const file = await this.readFile(owner, repo, name)
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
        message: Github.formCommitMessage(name, 'create'),
        owner,
        path: name,
        repo: `${this.repoNamespace}.${repo}`,
      })
    } catch (error) {
      if (!error.message.includes('"sha" wasn\'t supplied')) {
        throw error
      }
    }
    return this.readFile(owner, repo, name)
  }

  public async updateFile({
    username,
    repo,
    filename,
    content,
  }: UpdateFileInput): Promise<File> {
    const { sha, content: originalContent } = await this.readFile(
      username,
      repo,
      filename
    )

    await this.octokit.repos.updateFile({
      content: Github.encodeToBase64(content ?? originalContent ?? ''),
      message: Github.formCommitMessage(filename, 'update'),
      owner: username,
      path: filename,
      repo: `${this.repoNamespace}.${repo}`,
      sha,
    })

    return this.readFile(username, repo, filename)
  }

  public async deleteFile(
    owner: string,
    repo: string,
    name: string
  ): Promise<File> {
    const file = await this.readFile(owner, repo, name)
    await this.octokit.repos.deleteFile({
      message: Github.formCommitMessage(name, 'delete'),
      owner,
      path: `${name}`,
      repo: `${this.repoNamespace}.${repo}`,
      sha: file.sha,
    })
    return { ...file, repo }
  }

  public async readTree(owner: string, repo: string): Promise<Node> {
    const {
      repository: {
        object: {
          history: {
            nodes: [{ oid }],
          },
        },
      },
    } = await this.graphql.request(GetCommit, {
      name: repo,
      owner,
    })

    const {
      data: { tree },
    } = await this.octokit.git.getTree({
      owner,
      recursive: 1,
      repo,
      tree_sha: oid,
    })

    return createTreeBeard(tree)
  }
}
