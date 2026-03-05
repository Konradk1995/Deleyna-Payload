import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const StepSection: Block = {
  slug: 'stepSection',
  interfaceName: 'StepSectionBlock',
  imageURL: '/block-previews/step-section.svg',
  imageAltText: 'Card Section: Headline with numbered steps or icon cards',
  labels: {
    singular: { de: 'Karten-Sektion', en: 'Card section' },
    plural: { de: 'Karten-Sektionen', en: 'Card sections' },
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: { de: 'Karten (einfach)', en: 'Cards (simple)' }, value: 'cards' },
        { label: { de: 'Timeline (Linie + Kreise + Ergebnis)', en: 'Timeline (line + circles + result)' }, value: 'timeline' },
        { label: { de: 'Flow (Icons mit Pfeilen)', en: 'Flow (icons with arrows)' }, value: 'flow' },
      ],
      admin: {
        description:
          'Cards: Number or icon per card. Timeline: Numbered circles with connecting line. Flow: Horizontal icons with arrows.',
      },
    },
    {
      name: 'cardDisplay',
      type: 'select',
      defaultValue: 'number',
      options: [
        { label: { de: 'Zahlen (z. B. 01, 02, 03)', en: 'Numbers (e.g. 01, 02, 03)' }, value: 'number' },
        { label: { de: 'Icons', en: 'Icons' }, value: 'icon' },
      ],
      admin: {
        description:
          'Numbers: Large number in card (steps). Icons: Icon image instead of number (overview).',
        condition: (_, siblingData) => siblingData?.layout === 'cards',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: { de: 'Weiß', en: 'White' }, value: 'white' },
        { label: { de: 'Hellgrau', en: 'Light gray' }, value: 'muted' },
      ],
      admin: { description: { de: 'Hintergrundfarbe der Section (angepasst an Dark/Light Mode)', en: 'Section background colour (adapts to dark mode)' } },
    },
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: { description: { de: 'Kleines Label über der Überschrift', en: 'Small label above the headline' } },
    },
    {
      name: 'headline',
      type: 'text',
      localized: true,
      admin: {
        description: { de: 'Überschrift der Section (H2) — leer lassen zum Ausblenden', en: 'Section headline (H2) — leave empty to hide' },
      },
    },
    {
      name: 'headlineHighlight',
      type: 'text',
      localized: true,
      admin: {
        description: { de: 'Wort oder Phrase in der Überschrift in Primärfarbe hervorheben', en: 'Word or phrase to highlight in primary colour within the headline' },
      },
    },
    {
      name: 'intro',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: { de: 'Optionaler Intro-Text unter der Überschrift', en: 'Optional intro text below the headline' },
      },
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      required: true,
      labels: {
        singular: { de: 'Eintrag', en: 'Item' },
        plural: { de: 'Einträge', en: 'Items' },
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          admin: {
            description: { de: 'Nummer oder Label, z. B. "01", "02", "03"', en: 'Number or label, e.g. "01", "02", "03"' },
            condition: (data) => data?.cardDisplay !== 'icon' || data?.layout === 'timeline',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: { de: 'Titel des Eintrags', en: 'Item title' },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            description: { de: 'Kurzbeschreibung', en: 'Short description' },
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
          admin: {
            description: { de: 'Kurzer Untertitel unter dem Titel (nur Flow-Variante)', en: 'Short subtitle below the title (Flow variant only)' },
            condition: (data) => data?.layout === 'flow',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: { de: 'Icon oder Bild für diesen Eintrag', en: 'Icon or image for this item' },
          },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: { de: 'Diesen Eintrag mit Primärfarbe hervorheben (Flow-Variante)', en: 'Highlight this item with primary colour accent (Flow variant)' },
            condition: (data) => data?.layout === 'flow',
          },
        },
      ],
      admin: {
        description: { de: 'Einträge der Section (max. 6 für optimale Darstellung)', en: 'Section items (max. 6 for optimal display)' },
      },
    },
    link({
      appearances: false,
      overrides: {
        name: 'cta',
        label: { de: 'CTA-Button', en: 'CTA button' },
        admin: {
          description: { de: 'Optionaler CTA-Button unter den Einträgen', en: 'Optional CTA button below the items' },
        },
      },
    }),
    {
      name: 'ctaPosition',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: { de: 'Zentriert', en: 'Center' }, value: 'center' },
        { label: { de: 'Links', en: 'Left' }, value: 'left' },
        { label: { de: 'Rechts', en: 'Right' }, value: 'right' },
      ],
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.cta?.label),
        description: { de: 'Ausrichtung des CTA-Buttons', en: 'CTA button alignment' },
      },
    },

    // ── Flow variant settings ──
    {
      type: 'collapsible',
      label: { de: 'Flow-Einstellungen', en: 'Flow settings' },
      admin: {
        description: { de: 'Einstellungen für die Flow-Layout-Variante', en: 'Settings specific to the Flow layout variant' },
        condition: (_, siblingData) => siblingData?.layout === 'flow',
      },
      fields: [
        {
          name: 'flowContainerStyle',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: { de: 'Kein Container', en: 'No container' }, value: 'none' },
            { label: { de: 'Card (abgerundete Box)', en: 'Card (rounded box)' }, value: 'card' },
          ],
          admin: {
            description: { de: 'Flow-Einträge in eine Karten-Box einrahmen', en: 'Whether to wrap the flow items in a card container' },
          },
        },
        {
          name: 'flowDescription',
          type: 'textarea',
          localized: true,
          admin: {
            description: {
              de: 'Optionaler Beschreibungstext unter den Flow-Einträgen (Fett mit **text**)',
              en: 'Optional description text below the flow items (supports bold with **text**)',
            },
          },
        },
      ],
    },

    // ── Result box (Timeline only) ──
    {
      type: 'collapsible',
      label: { de: 'Ergebnis-Box (Timeline-Layout)', en: 'Result box (Timeline layout)' },
      admin: {
        description: { de: 'Optionale Box unter den Einträgen. Nur bei Timeline-Layout sichtbar.', en: 'Optional box below the items. Only visible with Timeline layout.' },
        condition: (_, siblingData) => siblingData?.layout === 'timeline',
      },
      fields: [
        {
          name: 'resultTitle',
          type: 'text',
          localized: true,
          admin: { description: { de: 'Titel der Ergebnis-Box', en: 'Result box title' } },
        },
        {
          name: 'resultDescription',
          type: 'textarea',
          localized: true,
          admin: { description: { de: 'Kurzer Text unter dem Titel', en: 'Short text below the title' } },
        },
      ],
    },
  ],
}
