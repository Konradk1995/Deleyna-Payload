import type { GlobalConfig } from 'payload'
import { adminOnly } from '../access'

/**
 * Theme Einstellungen – nur Standard-Theme und Farb-Preset.
 * Die tatsächlichen Farben liegen in globals.css (Deleyna Dark/Copper).
 */
export const ThemeSettings: GlobalConfig = {
    slug: 'theme-settings',
    label: { de: 'Design & Theme', en: 'Design & Theme' },
    access: {
        read: () => true,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Einstellungen', en: 'Settings' },
        description: { de: 'Standard-Theme und Farb-Preset für die Website. Hintergrund und Akzente folgen dem Deleyna-Design (dunkel, Copper/Gold).', en: 'Default theme and colour preset for the website. Background and accents follow the Deleyna design (dark, copper/gold).' },
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Theme', en: 'Theme' },
                    fields: [
                        {
                            name: 'defaultTheme',
                            type: 'select',
                            label: { de: 'Standard-Theme', en: 'Default theme' },
                            defaultValue: 'dark',
                            required: true,
                            admin: {
                                description: { de: 'Welches Theme Besucher beim ersten Mal sehen (ohne gespeicherte Auswahl).', en: 'Which theme visitors see on first visit (without saved preference).' },
                            },
                            options: [
                                { label: { de: 'Dunkel (Empfohlen – Deleyna Look)', en: 'Dark (recommended – Deleyna look)' }, value: 'dark' },
                                { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                                { label: { de: 'System (Browser-Einstellung)', en: 'System (browser setting)' }, value: 'system' },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Farb-Preset', en: 'Colour preset' },
                    fields: [
                        {
                            name: 'colorPreset',
                            type: 'select',
                            label: { de: 'Aktives Farb-Preset', en: 'Active colour preset' },
                            defaultValue: 'deleyna-dark',
                            admin: {
                                description: {
                                    de: 'Die Website nutzt dieses Preset. Farben werden in globals.css vordefiniert – hier nur zur Info.',
                                    en: 'The site uses this preset. Colours are defined in globals.css – here for reference only.',
                                },
                                readOnly: true,
                            },
                            options: [
                                {
                                    label: {
                                        de: 'Deleyna Dark (Standard) – Dunkler Hintergrund, Copper/Gold-Akzente',
                                        en: 'Deleyna Dark (default) – Dark background, copper/gold accents',
                                    },
                                    value: 'deleyna-dark',
                                },
                                {
                                    label: {
                                        de: 'Deleyna Light – Heller Hintergrund, Copper-Akzente',
                                        en: 'Deleyna Light – Light background, copper accents',
                                    },
                                    value: 'deleyna-light',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
