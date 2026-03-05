import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath } from 'node:url'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    resolve: {
        alias: {
            'next/navigation': fileURLToPath(new URL('./node_modules/next/navigation.js', import.meta.url)),
        },
    },
    test: {
        environment: 'node',
        setupFiles: ['./vitest.setup.ts'],
        include: ['tests/int/**/*.int.spec.ts'],
        server: {
            deps: {
                inline: ['next-intl'],
            },
        },
    },
})
