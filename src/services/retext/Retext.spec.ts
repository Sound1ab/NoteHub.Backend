import { RETEXT_SETTINGS, Retext } from './Retext'

describe('Retext', () => {
  const retext = new Retext()
  describe('when processing frontmatter', () => {
    const availablePlugins = [
      'spell',
      'equality',
      'indefiniteArticle',
      'repeatedWords',
    ]

    const unavilablePlugin = 'astrology'

    it('should return a list of plugins', async () => {
      const markdown = `---\nretext:\n  - spell\n  - equality\n  - indefiniteArticle\n  - repeatedWords\n---\n\n# hello`

      const result = await retext.processFrontMatter(markdown)

      expect(result).toEqual(availablePlugins)
    })

    it('should should exclude any plugins that are not available', async () => {
      const markdown = `---\nretext:\n  - spell\n  - equality\n  - indefiniteArticle\n  - repeatedWords\n  - ${unavilablePlugin}\n---\n\n# hello`

      const result = await retext.processFrontMatter(markdown)

      expect(result).toEqual(availablePlugins)
    })

    it('should return undefined if retext option is not passed', async () => {
      const markdown = `---\nsomeotherthing:\n  - spell\n  - equality\n  - indefiniteArticle\n  - repeatedWords\n  - ${unavilablePlugin}\n---\n\n# hello`

      const result = await retext.processFrontMatter(markdown)

      expect(result).toEqual(undefined)
    })

    it('should return undefined if no frontmatter is passed', async () => {
      const markdown = `# hello`

      const result = await retext.processFrontMatter(markdown)

      expect(result).toEqual(undefined)
    })
  })

  describe('addPlugin', () => {
    it.each(Object.values(RETEXT_SETTINGS))(
      'should add the specified plugin',
      async option => {
        const result = await retext.addPlugin([option])

        const plugins = (result as any).attachers.map(
          (attacher: any) => attacher[0].name
        )

        expect(plugins).toContain(option)
      }
    )

    it('should add multiple plugins', async () => {
      const result = await retext.addPlugin([
        RETEXT_SETTINGS.SPELLING,
        RETEXT_SETTINGS.REPEATED,
      ])

      const plugins = (result as any).attachers.map(
        (attacher: any) => attacher[0].name
      )

      expect(plugins).toContain(RETEXT_SETTINGS.SPELLING)
      expect(plugins).toContain(RETEXT_SETTINGS.REPEATED)
    })
  })

  describe('processMarkdown', () => {
    const sources = [
      'retext-spell',
      'retext-equality',
      'retext-indefinite-article',
      'retext-repeated-words',
    ]

    it('should create messages from plugins', async () => {
      const spell = 'spelling mistace '
      const equality = 'she is doing something '
      const indefiniteArticle = 'this is a indefinite article '
      const repeated = 'this this is repeated myself '

      const markdown = spell + equality + indefiniteArticle + repeated

      const parser = await retext.addPlugin(Object.values(RETEXT_SETTINGS))

      const messages = await retext.processMarkdownTree(markdown, parser)

      const result = messages.map(message => message.source)

      sources.forEach(source => {
        expect(result).toContain(source)
      })
    })
  })
})
