const rootFile = {
  mode: '100644',
  path: 'README.md',
  sha: '21e60f8358c6175f2efbbe34808a4d99d12d18ee',
  size: 6,
  type: 'blob',
  url:
    'https://api.github.com/repos/Sound1ab/NoteHub.Test/git/blobs/21e60f8358c6175f2efbbe34808a4d99d12d18ee',
}

const fileDepthOne = {
  mode: '100644',
  path: 'folder/file.md',
  sha: '3e23ae484d9e26ececeb15b44c3393420f863766',
  size: 7,
  type: 'blob',
  url:
    'https://api.github.com/repos/Sound1ab/NoteHub.Test/git/blobs/3e23ae484d9e26ececeb15b44c3393420f863766',
}

const fileDepthTwo = {
  mode: '100644',
  path: 'folder/folder2/file2.md',
  sha: '1385f264afb75a56a5bec74243be9b367ba4ca08',
  size: 4,
  type: 'blob',
  url:
    'https://api.github.com/repos/Sound1ab/NoteHub.Test/git/blobs/1385f264afb75a56a5bec74243be9b367ba4ca08',
}

const rootFolder = {
  mode: '040000',
  path: 'folder',
  sha: '440bcc562c69b0ccb7e71d54f57a0d802447b60d',
  size: 6,
  type: 'tree',
  url:
    'https://api.github.com/repos/Sound1ab/NoteHub.Test/git/trees/440bcc562c69b0ccb7e71d54f57a0d802447b60d',
}

const folderDepthOne = {
  mode: '040000',
  path: 'folder/folder2',
  sha: 'f19f8947571bee8b58cc9a13e245684b1209a259',
  size: 6,
  type: 'tree',
  url:
    'https://api.github.com/repos/Sound1ab/NoteHub.Test/git/trees/f19f8947571bee8b58cc9a13e245684b1209a259',
}

export const githubTreeData = [
  rootFile,
  rootFolder,
  fileDepthOne,
  folderDepthOne,
  fileDepthTwo,
]

export const treeBeard = {
  children: [
    {
      name: 'README.md',
      toggled: true,
    },
    {
      children: [
        {
          name: 'file.md',
          toggled: true,
        },
        {
          children: [
            {
              name: 'file2.md',
              toggled: true,
            },
          ],
          name: 'folder2',
          toggled: true,
        },
      ],
      name: 'folder',
      toggled: true,
    },
  ],
  name: 'root',
  toggled: true,
}
