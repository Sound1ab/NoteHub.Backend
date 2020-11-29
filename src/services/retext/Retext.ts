import unified, { Processor } from 'unified'

import { Retext_Settings } from '../../resolvers-types'
import dictionary from 'dictionary-en-gb'
import equality from 'retext-equality'
import extract from 'remark-extract-frontmatter'
import frontmatter from 'remark-frontmatter'
import indefiniteArticle from 'retext-indefinite-article'
import parse from 'remark-parse'
import parseEnglish from 'parse-english'
import readability from 'retext-readability'
import remark2retext from 'remark-retext'
import remarkStringify from 'remark-stringify'
import repeated from 'retext-repeated-words'
import retextStringify from 'retext-stringify'
import spell from 'retext-spell'
import yaml from 'yaml'

export class Retext {
  private frontMatterParser = unified()
    .use(parse)
    .use(remarkStringify)
    .use(frontmatter)
    .use(extract, { yaml: yaml.parse })

  private retextSettings: Retext_Settings[]

  constructor(retextSettings: Retext_Settings[]) {
    this.retextSettings = retextSettings
  }

  public createParser() {
    const retextParser = unified()
      .use(parse)
      .use(remark2retext, parseEnglish)

    this.retextSettings.forEach(option => {
      switch (option) {
        case Retext_Settings.Spell:
          retextParser.use(spell, dictionary)
          break
        case Retext_Settings.Equality:
          retextParser.use(equality)
          break
        case Retext_Settings.IndefiniteArticle:
          retextParser.use(indefiniteArticle)
          break
        case Retext_Settings.RepeatedWords:
          retextParser.use(repeated)
          break
        case Retext_Settings.Readability:
          retextParser.use(readability)
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

  private isPlugin(value: string): value is Retext_Settings {
    return Object.values(Retext_Settings).includes(value as Retext_Settings)
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
