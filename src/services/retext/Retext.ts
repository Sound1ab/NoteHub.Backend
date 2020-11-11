import { Node } from 'unist'
import { VFileCompatible } from 'vfile'
import { VFileMessage } from 'vfile-message'
import dictionary from 'dictionary-en-gb'
import latin from 'retext-latin'
import parse from 'remark-parse'
import repeated from 'retext-repeated-words'
import spell from 'retext-spell'
import stringify from 'retext-stringify'
import unified from 'unified'
import visit from 'unist-util-visit'

interface INode extends Node {
  value: string
}

export class Retext {
  public messages: VFileCompatible[] = []

  public createMarkdownTree(markdown: string) {
    return unified()
      .use(parse)
      .parse(markdown)
  }

  public async processMarkdownTree(tree: Node) {
    const process = unified()
      .use(latin)
      .use(stringify)
      .use(spell, dictionary)
      .use(repeated)

    await this.visitAsync(tree, 'text', async (node: INode) => {
      const file = await process.process(node.value)

      if (!file) {
        return
      }

      const messages = this.getMessagesWithINodeLineLocation(
        file.messages,
        node
      )

      this.messages = [...this.messages, ...messages]
    })

    return this.messages
  }

  private getMessagesWithINodeLineLocation(
    messages: VFileMessage[],
    node: INode
  ) {
    return messages.map(message => ({
      ...message,
      location: {
        ...message.location,
        end: {
          ...message?.location?.end,
          line: node.position?.end.line,
        },
        start: {
          ...message?.location?.start,
          line: node.position?.start.line,
        },
      },
    }))
  }

  private async visitAsync(
    tree: Node,
    matcher: string,
    asyncVisitor: (node: INode) => Promise<unknown>
  ) {
    const matches: INode[] = []

    visit(tree, matcher, (node: INode) => {
      matches.push(node)
    })

    const promises = matches.map(match => asyncVisitor(match))
    await Promise.all(promises)

    return tree
  }
}
