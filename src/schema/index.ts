import { mergeTypes } from 'merge-graphql-schemas'

export function generateTypedefs() {
  const file = require('./file.graphql')
  const image = require('./image.graphql')
  const repo = require('./repo.graphql')
  const user = require('./user.graphql')
  return mergeTypes([file, image, repo, user], { all: true })
}
