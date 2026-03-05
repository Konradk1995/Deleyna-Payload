import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Deleyna Agency',
        short_name: 'Deleyna',
        description: 'Talent Agency for Dancers & Models',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#b87333',
        icons: [
            {
                src: '/favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
            },
        ],
    }
}
