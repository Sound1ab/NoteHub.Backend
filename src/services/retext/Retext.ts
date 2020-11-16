import { Node } from 'unist'
import { VFileCompatible } from 'vfile'
import { VFileMessage } from 'vfile-message'
import dictionary from 'dictionary-en-gb'
import equality from 'retext-equality'
import indefiniteArticle from 'retext-indefinite-article'
import latin from 'retext-latin'
import parse from 'remark-parse'
import repeated from 'retext-repeated-words'
import spell from 'retext-spell'
import stringify from 'retext-stringify'
import unified from 'unified'
import visit from 'unist-util-visit'

interface IVFileMessage extends VFileMessage {
  actual?: string
}

interface INode extends Node {
  value: string
}

export class Retext {
  public createMarkdownTree(markdown: string) {
    return unified()
      .use(parse)
      .parse(markdown)
  }

  public async processMarkdownTree(tree: Node) {
    let messageCollection: VFileCompatible[] = []

    const process = unified()
      .use(latin)
      .use(stringify)
      .use(spell, dictionary)
      .use(repeated)
      .use(equality)
      .use(indefiniteArticle)

    await this.visitAsync(tree, 'text', async (node: INode) => {
      const file = await process.process(node.value)

      if (!file || !file.messages || !Array.isArray(file.messages)) {
        return
      }

      const messages = this.getMessagesWithINodeLineLocation(
        file.messages,
        node
      )

      messageCollection = [...messageCollection, ...messages]
    })

    return messageCollection
  }

  private getMessagesWithINodeLineLocation(
    messages: IVFileMessage[],
    node: INode
  ) {
    return messages.map(mappedMessage => {
      const startLetter =
        (node.position?.start.offset ?? 0) +
        (mappedMessage.location.start?.offset ?? 0)
      const wordLength = mappedMessage.actual?.length ?? 0
      const endLetter = startLetter + wordLength

      return {
        ...mappedMessage,
        actual: wordLength,
        location: {
          ...mappedMessage.location,
          end: {
            offset: endLetter,
          },
          start: {
            offset: startLetter,
          },
        },
      }
    })
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
