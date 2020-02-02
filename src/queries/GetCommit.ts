export const GetCommit = `
  query getCommitDate {
    repository(owner: "Sound1ab", name: "NoteHub.testing") {
      folder: object(expression: "master:") {
        ... on Tree {
          entries {
            name
            object {
              oid
              id
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }
`
