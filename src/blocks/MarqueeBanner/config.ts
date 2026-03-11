import type { Block } from 'payload'

export const MarqueeBannerBlock: Block = {
    slug: 'marqueeBanner',
    interfaceName: 'MarqueeBannerBlock',
    imageURL: '/block-previews/marquee-banner.svg',
    imageAltText: 'Scrolling marquee text banner',
    labels: {
        singular: { de: 'Laufband', en: 'Marquee Banner' },
        plural: { de: 'Laufbänder', en: 'Marquee Banners' },
    },
    fields: [
        {
            name: 'text',
            type: 'text',
            required: true,
            localized: true,
            label: { de: 'Lauftext', en: 'Marquee text' },
            admin: {
                description: {
                    de: 'Text, der endlos durchläuft (z. B. "DESIGNED FOR MODERN BRANDS AND TALENT").',
                    en: 'Text that scrolls continuously (e.g. "DESIGNED FOR MODERN BRANDS AND TALENT").',
                },
            },
        },
        {
            name: 'speed',
            type: 'select',
            defaultValue: 'normal',
            label: { de: 'Geschwindigkeit', en: 'Speed' },
            options: [
                { label: { de: 'Langsam', en: 'Slow' }, value: 'slow' },
                { label: { de: 'Normal', en: 'Normal' }, value: 'normal' },
                { label: { de: 'Schnell', en: 'Fast' }, value: 'fast' },
            ],
            admin: {
                description: {
                    de: 'Laufgeschwindigkeit der Animation.',
                    en: 'Speed of the scrolling animation.',
                },
            },
        },
        {
            name: 'appearance',
            type: 'select',
            defaultValue: 'solid',
            label: { de: 'Text-Stil', en: 'Text style' },
            options: [
                { label: { de: 'Ausgefüllt', en: 'Solid' }, value: 'solid' },
                { label: { de: 'Kontur', en: 'Outline' }, value: 'outline' },
            ],
            admin: {
                description: {
                    de: 'Solid = gefüllter Text, Outline = nur Umriss.',
                    en: 'Solid = filled text, Outline = stroke only.',
                },
            },
        },
    ],
}
