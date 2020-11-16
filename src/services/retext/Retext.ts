import dictionary from 'dictionary-en-gb'
import equality from 'retext-equality'
import indefiniteArticle from 'retext-indefinite-article'
import parse from 'remark-parse'
import parseEnglish from 'parse-english'
import remark2retext from 'remark-retext'
import repeated from 'retext-repeated-words'
import spell from 'retext-spell'
import stringify from 'retext-stringify'
import unified from 'unified'

export class Retext {
  private parser = unified()
    .use(parse)
    .use(remark2retext, parseEnglish)
    .use(spell, dictionary)
    .use(equality)
    .use(indefiniteArticle)
    .use(repeated)
    .use(stringify)

  public async processMarkdownTree(markdown: string) {
    const file = await this.parser.process(markdown)

    return file.messages.map(message => {
      return {
        ...message,
        actual: message.actual,
        location: {
          ...message.location,
          end: {
            offset: message.location.end.offset,
          },
          start: {
            offset: message.location.start.offset,
          },
        },
      }
    })
  }
}
