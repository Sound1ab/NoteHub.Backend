export const GetCommit = `
  query GetCommit($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: "main") {
        ... on Commit {
          history(first: 1) {
            nodes {
              oid
            }
          }
        }
      }
    }
  }
`
