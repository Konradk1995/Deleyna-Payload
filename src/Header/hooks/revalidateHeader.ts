import type { GlobalAfterChangeHook } from 'payload'

export const revalidateHeader: GlobalAfterChangeHook = async ({
    doc,
    req: { payload, context },
}) => {
    if (!context.disableRevalidate) {
        try {
            const { revalidateTag } = await import('next/cache')
            const { default: localization } = await import('@/i18n/localization')
            payload.logger.info(`Revalidating header`)
            for (const { code } of localization.locales) {
                revalidateTag(`global_header_${code}`)
            }
        } catch (error) {
            // Silently fail if revalidateTag is not available (e.g., in seed scripts)
            payload.logger.debug(
                `Could not revalidate header: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
        }
    }

    return doc
}
