import { Node_Type } from '../resolvers-types'

export function encodeNodeId(type: Node_Type, ...parts: string[]): string {
  return Buffer.from([type, ...parts].join(':')).toString('base64')
}
