import { GitCreateTreeResponseTreeItem } from '@octokit/rest'

export function createFolderNode(name: string) {
  return {
    children: [],
    name,
    toggled: true,
  }
}

export function createFileNode(name: string) {
  return {
    name,
    toggled: true,
  }
}

interface INode {
  name: string
  toggled: boolean
  children?: INode[]
}

export function createTreeBeard(tree: GitCreateTreeResponseTreeItem[]) {
  const treeBeard: any = {
    children: [],
    name: 'root',
    toggled: true,
  }

  for (const { path, type } of tree) {
    updateNode(path.split('/'), type, treeBeard)
  }

  return treeBeard
}

export function updateNode(
  path: string[],
  type: string,
  currentNode: INode
): void {
  if (path.length === 1) {
    const [name] = path

    const children = currentNode?.children ? currentNode.children : []

    const isFolder = type === 'tree'

    currentNode.children = [
      ...children,
      isFolder ? createFolderNode(name) : createFileNode(name),
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

  return updateNode(rest, type, nextNode)
}
