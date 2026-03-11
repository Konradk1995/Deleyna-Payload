import type { GlobalAfterChangeHook } from 'payload'

type ArchiveRevalidateConfig = {
    basePath: '/blog' | '/talents' | '/jobs'
    deLocalizedPath: '/magazin' | '/talente' | '/jobs'
    logLabel: 'posts archive' | 'talents archive' | 'jobs archive'
}

const LOCALES = ['de', 'en'] as const

function createArchiveRevalidateHook({
    basePath,
    deLocalizedPath,
    logLabel,
}: ArchiveRevalidateConfig): GlobalAfterChangeHook {
    return async ({ doc, req: { payload, context } }) => {
        if (context.disableRevalidate) return doc

        try {
            const { revalidatePath } = await import('next/cache')
            payload.logger.info(`Revalidating ${logLabel}`)

            for (const locale of LOCALES) {
                revalidatePath(`/${locale}${basePath}`)
                if (locale === 'de') {
                    revalidatePath(`/${locale}${deLocalizedPath}`)
                }
            }
        } catch (error) {
            payload.logger.debug(
                `Could not revalidate ${logLabel}: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            )
        }

        return doc
    }
}

export const revalidatePostsArchive = createArchiveRevalidateHook({
    basePath: '/blog',
    deLocalizedPath: '/magazin',
    logLabel: 'posts archive',
})

export const revalidateTalentsArchive = createArchiveRevalidateHook({
    basePath: '/talents',
    deLocalizedPath: '/talente',
    logLabel: 'talents archive',
})

export const revalidateJobsArchive = createArchiveRevalidateHook({
    basePath: '/jobs',
    deLocalizedPath: '/jobs',
    logLabel: 'jobs archive',
})
