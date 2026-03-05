import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/blocks/**/*.{js,ts,jsx,tsx,mdx}',
        './src/Header/**/*.{js,ts,jsx,tsx,mdx}',
        './src/Footer/**/*.{js,ts,jsx,tsx,mdx}',
        './src/heros/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                muted: {
                    DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
                    foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
                },
                primary: {
                    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
                    foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
                    foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
                    hover: 'rgb(var(--accent-hover) / <alpha-value>)',
                },
                destructive: {
                    DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
                    foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
                },
                success: {
                    DEFAULT: 'rgb(var(--success) / <alpha-value>)',
                    foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
                },
                card: {
                    DEFAULT: 'rgb(var(--card) / <alpha-value>)',
                    foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
                },
                border: 'rgb(var(--border) / <alpha-value>)',
                input: 'rgb(var(--input) / <alpha-value>)',
                ring: 'rgb(var(--ring) / <alpha-value>)',
                /* Chrome/Copper (chrome-grace-talent) */
                copper: {
                    DEFAULT: 'rgb(var(--copper) / <alpha-value>)',
                    glow: 'rgb(var(--copper-glow) / <alpha-value>)',
                },
                chrome: {
                    start: 'rgb(var(--chrome-start) / <alpha-value>)',
                    mid: 'rgb(var(--chrome-mid) / <alpha-value>)',
                    end: 'rgb(var(--chrome-end) / <alpha-value>)',
                },
                /* Talent card palettes (chrome-grace-talent) */
                talent: {
                    sage: 'rgb(var(--talent-sage) / <alpha-value>)',
                    peach: 'rgb(var(--talent-peach) / <alpha-value>)',
                    cream: 'rgb(var(--talent-cream) / <alpha-value>)',
                },
                'on-media': 'rgb(var(--on-media) / <alpha-value>)',
                'on-media-muted': 'rgb(var(--on-media-muted) / <alpha-value>)',
                'media-overlay': 'rgb(var(--media-overlay) / <alpha-value>)',
                surface: {
                    inverse: 'rgb(var(--surface-inverse) / <alpha-value>)',
                },
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
                display: ['var(--font-display)', 'Georgia', 'serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            /* Container: mittig + einheitliches Padding (Header, Footer, Blöcke, Seiten) */
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '1.5rem',
                    lg: '2rem',
                },
            },
        },
    },
    plugins: [],
}

export default config
