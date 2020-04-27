import { GitCreateTreeResponseTreeItem } from '@octokit/rest'

export function createFolderNode(
  name: string,
  { path, type }: GitCreateTreeResponseTreeItem
) {
  return {
    children: [],
    name,
    path,
    toggled: true,
    type,
  }
}

export function createFileNode(
  name: string,
  { path, type }: GitCreateTreeResponseTreeItem
) {
  return {
    name,
    path,
    toggled: true,
    type,
  }
}

interface INode {
  name: string
  toggled: boolean
  children?: INode[]
  path: string
  type: string
}

export function createTreeBeard(tree: GitCreateTreeResponseTreeItem[]) {
  const treeBeard: INode = {
    children: [],
    name: 'root',
    path: '/',
    toggled: true,
    type: 'tree',
  }

  for (const gitNode of tree) {
    const { path, type } = gitNode

    updateNode(path.split('/'), type, treeBeard, gitNode)
  }

  return treeBeard
}

export function updateNode(
  path: string[],
  type: string,
  currentNode: INode,
  gitNode: GitCreateTreeResponseTreeItem
): void {
  if (path.length === 1) {
    const [name] = path

    const children = currentNode?.children ? currentNode.children : []

    const isFolder = type === 'tree'

    currentNode.children = [
      ...children,
      isFolder
        ? createFolderNode(name, gitNode)
        : createFileNode(name, gitNode),
    ]
    return
  }

  if (!currentNode.children) {
    throw new Error('CurrentNode has no children')
  }

  const [currentPath, ...rest] = path

  const nextNode = currentNode.children.find(node => node.name === currentPath)

  if (!nextNode) {
    throw new Error('Unable to find next node')
  }

  return updateNode(rest, type, nextNode, gitNode)
}
