import dictionary from 'dictionary-en-gb'
import equality from 'retext-equality'
import extract from 'remark-extract-frontmatter'
import frontmatter from 'remark-frontmatter'
import indefiniteArticle from 'retext-indefinite-article'
import parse from 'remark-parse'
import parseEnglish from 'parse-english'
import remark2retext from 'remark-retext'
import remarkStringify from 'remark-stringify'
import repeated from 'retext-repeated-words'
import retextStringify from 'retext-stringify'
import spell from 'retext-spell'
import unified, { Processor } from 'unified'
import yaml from 'yaml'

export enum RETEXT_SETTINGS {
  SPELLING = 'spell',
  EQUALITY = 'equality',
  INDEFINITE_ARTICLE = 'indefiniteArticle',
  REPEATED = 'repeatedWords',
}

export class Retext {
  private frontMatterParser = unified()
    .use(parse)
    .use(remarkStringify)
    .use(frontmatter)
    .use(extract, { yaml: yaml.parse })

  public addPlugin(options: RETEXT_SETTINGS[]) {
    const retextParser = unified()
      .use(parse)
      .use(remark2retext, parseEnglish)

    options.forEach(option => {
      switch (option) {
        case RETEXT_SETTINGS.SPELLING:
          retextParser.use(spell, dictionary)
          break
        case RETEXT_SETTINGS.EQUALITY:
          retextParser.use(equality)
          break
        case RETEXT_SETTINGS.INDEFINITE_ARTICLE:
          retextParser.use(indefiniteArticle)
          break
        case RETEXT_SETTINGS.REPEATED:
          retextParser.use(repeated)
          break
      }
    })

    return retextParser.use(retextStringify)
  }

  public async processMarkdownTree(markdown: string, parser: Processor) {
    const file = await parser.process(markdown)

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

  public async processFrontMatter(markdown: string) {
    const file = await this.frontMatterParser.process(markdown)

    if (
      file.data === undefined ||
      typeof file.data !== 'object' ||
      file.data === null ||
      !this.hasRetextProperty(file.data)
    ) {
      return
    }

    const { retext } = file.data

    return retext.filter(this.isString).filter(this.isPlugin)
  }

  private isPlugin(value: string): value is RETEXT_SETTINGS {
    return Object.values(RETEXT_SETTINGS).includes(value as RETEXT_SETTINGS)
  }

  private hasRetextProperty(data: {
    retext?: unknown
  }): data is { retext: unknown[] } {
    return 'retext' in data && Array.isArray(data.retext)
  }

  private isString(value: unknown): value is string {
    return typeof value === 'string'
  }
}
