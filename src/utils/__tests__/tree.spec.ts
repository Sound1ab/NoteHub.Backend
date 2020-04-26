import {
  createFileNode,
  createFolderNode,
  createTreeBeard,
  updateNode,
} from '../tree'
import { githubTreeData, treeBeard } from './githubTreeData'

describe('tree', () => {
  it('should create a flattened object of nodes with children', async () => {
    const treeObject = createTreeBeard(githubTreeData)

    expect(treeObject).toEqual(treeBeard)
  })
})

describe('updateNode', () => {
  it('should throw an error if next node does not have children', async () => {
    const node = { name: 'root', toggled: true }

    expect(() =>
      updateNode(['MOCK_FOLDER', 'MOCK_FILE.md'], 'folder', node)
    ).toThrow('CurrentNode has no children')
  })

  it('should throw an error if next child node does not exist', async () => {
    const node = {
      children: [{ name: 'OTHER_MOCK_FOLDER', toggled: true }],
      name: 'root',
      toggled: true,
    }

    expect(() =>
      updateNode(['MOCK_FOLDER', 'MOCK_FILE.md'], 'file', node)
    ).toThrow('Unable to find next node')
  })
})

describe('createFolderNode', () => {
  it('should create a folder node', async () => {
    const folderNode = createFolderNode('MOCK_FOLDER')

    expect(folderNode).toEqual({
      children: [],
      name: 'MOCK_FOLDER',
      toggled: true,
    })
  })
})

describe('createFileNode', () => {
  it('should create a folder node', async () => {
    const folderNode = createFileNode('MOCK_FILE.md')

    expect(folderNode).toEqual({
      name: 'MOCK_FILE.md',
      toggled: true,
    })
  })
})
