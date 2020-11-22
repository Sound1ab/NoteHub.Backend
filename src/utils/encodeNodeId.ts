export enum Type {
  FILE = 'file',
}

export function encodeNodeId(type: Type, ...parts: string[]): string {
  return Buffer.from([type, ...parts].join(':')).toString('base64')
}
