import type { Block } from 'payload'

export const BigTextBlock: Block = {
  slug: 'bigText',
  interfaceName: 'BigTextBlock',
  labels: {
    singular: { de: 'Großer Text', en: 'Big text' },
    plural: { de: 'Großer Text', en: 'Big text' },
  },
  imageURL: '/block-previews/big-text.svg',
  imageAltText: 'Big Text Preview',
  fields: [
    {
      name: 'headingLevel',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: { de: 'H2 (Standard für Hauptsektionen)', en: 'H2 (default for main sections)' }, value: 'h2' },
        { label: { de: 'H3 (wenn Sektion unter anderem H2 steht)', en: 'H3 (when section is under another H2)' }, value: 'h3' },
      ],
      admin: {
        description: { de: 'Überschriften-Ebene für SEO-Hierarchie', en: 'Heading level for SEO hierarchy' },
      },
    },
    {
      name: 'lineOne',
      type: 'text',
      required: true,
      localized: true,
      label: { de: 'Zeile 1', en: 'Line 1' },
      admin: {
        description: { de: 'Erste Heading-Zeile', en: 'First heading line' },
      },
    },
    {
      name: 'lineOneHighlight',
      type: 'text',
      localized: true,
      label: { de: 'Hervorhebung Zeile 1', en: 'Highlight line 1' },
      admin: {
        description: { de: 'Wort/Phrase in Zeile 1, die hervorgehoben wird (z. B. in Schwarz statt Grau)', en: 'Word/phrase in line 1 to highlight (e.g. in black instead of grey)' },
      },
    },
    {
      name: 'lineTwo',
      type: 'text',
      localized: true,
      label: { de: 'Zeile 2 (optional)', en: 'Line 2 (optional)' },
      admin: {
        description: { de: 'Zweite Heading-Zeile (optional)', en: 'Second heading line (optional)' },
      },
    },
    {
      name: 'lineTwoHighlight',
      type: 'text',
      localized: true,
      label: { de: 'Hervorhebung Zeile 2', en: 'Highlight line 2' },
      admin: {
        description: { de: 'Wort/Phrase in Zeile 2, die hervorgehoben wird (z. B. in Schwarz statt Grau)', en: 'Word/phrase in line 2 to highlight (e.g. in black instead of grey)' },
      },
    },
  ],
}
