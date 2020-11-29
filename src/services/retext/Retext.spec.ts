import { Retext } from './Retext'
import { Retext_Settings } from '../../resolvers-types'

describe('Retext', () => {
  describe('addPlugin', () => {
    it.each([
      [Retext_Settings.Spell, 'spell'],
      [Retext_Settings.Readability, 'readability'],
      [Retext_Settings.RepeatedWords, 'repeatedWords'],
      [Retext_Settings.IndefiniteArticle, 'indefiniteArticle'],
      [Retext_Settings.Equality, 'equality'],
    ])('should add the specified plugin', async (retextSetting, plugin) => {
      const retext = new Retext([retextSetting])

      const result = await retext.createParser()

      const plugins = (result as any).attachers.map(
        (attacher: any) => attacher[0].name
      )

      expect(plugins).toContain(plugin)
    })

    it('should add multiple plugins', async () => {
      const retext = new Retext([
        Retext_Settings.Spell,
        Retext_Settings.Equality,
        Retext_Settings.IndefiniteArticle,
      ])

      const result = await retext.createParser()

      const plugins = (result as any).attachers.map(
        (attacher: any) => attacher[0].name
      )

      expect(plugins).toContain('spell')
      expect(plugins).toContain('equality')
      expect(plugins).toContain('indefiniteArticle')
    })
  })

  describe('processMarkdown', () => {
    const sources = [
      'retext-spell',
      'retext-equality',
      'retext-indefinite-article',
      'retext-repeated-words',
      'retext-readability',
    ]

    it('should create messages from plugins', async () => {
      const spell = 'spelling mistace '
      const equality = 'she is doing something '
      const indefiniteArticle = 'this is a indefinite article '
      const repeated = 'this this is repeated myself '
      const readability = `The constellation also contains an isolated neutron star—Calvera—and H1504+65, the hottest white dwarf yet discovered, with a surface temperature of 200,000 kelvin`

      const retext = new Retext(Object.values(Retext_Settings))

      const markdown =
        spell + equality + indefiniteArticle + repeated + readability

      const parser = await retext.createParser()

      const messages = await retext.processMarkdownTree(markdown, parser)

      const result = messages.map(message => message.source)

      sources.forEach(source => {
        expect(result).toContain(source)
      })
    })
  })
})
