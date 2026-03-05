/**
 * Seed Script - Testdaten für Deleyna
 *
 * Führe aus mit: npx tsx src/scripts/seed.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config'
import { adminSeeder } from './seeders/admin.seeder'
import { talentsSeeder } from './seeders/talents.seeder'
import { pagesSeeder } from './seeders/pages.seeder'
import { talentsArchiveSeeder } from './seeders/talentsArchive.seeder'
import { postsArchiveSeeder } from './seeders/postsArchive.seeder'
import { headerSeeder } from './seeders/header.seeder'
import { footerSeeder } from './seeders/footer.seeder'
import { formsSeeder } from './seeders/forms.seeder'
import { postsSeeder } from './seeders/posts.seeder'
import { fullContentSeeder } from './seeders/fullContent.seeder'
import { mediaSeeder } from './seeders/media.seeder'
import { seoSeeder } from './seeders/seo.seeder'
import { globalsSeeder } from './seeders/globals.seeder'

export async function seed() {
    console.log('🌱 Starting seed...')
    console.log('')

    try {
        const payload = await getPayload({ config })
        console.log('✅ Connected to database')
        console.log('')

        // Guard: skip if database already has content (prevents duplicate seed on redeploy)
        const { totalDocs } = await payload.count({ collection: 'pages' })
        if (totalDocs > 0) {
            console.log('⏭️  Database already seeded (' + totalDocs + ' pages found). Skipping.')
            process.exit(0)
        }

        // Seed media library first (used by talents/posts/pages)
        // In some minimal container environments (e.g. Alpine), image/font tooling can fail hard.
        // Allow explicit skip via env to avoid native crashes in those environments.
        let mediaResult: { created: number; updated: number; total: number; failed?: boolean } = {
            created: 0,
            updated: 0,
            total: 0,
            failed: false,
        }
        const skipMediaSeed = process.env.SKIP_MEDIA_SEED === 'true'
        if (skipMediaSeed) {
            mediaResult = { created: 0, updated: 0, total: 0, failed: true }
            console.log('⏭️ Skipping media seeding (SKIP_MEDIA_SEED=true)')
        } else {
            try {
                mediaResult = await mediaSeeder(payload)
            } catch (_error) {
                mediaResult = { created: 0, updated: 0, total: 0, failed: true }
                console.warn('⚠️ Media seeding failed, continuing without generated media:', _error)
            }
        }
        console.log('')

        // Seed talents
        const talentsResult = await talentsSeeder(payload)
        console.log('')

        // Seed initial pages (home first)
        const pagesResult = await pagesSeeder(payload)
        console.log('')

        // Seed archive globals (Talents + Blog)
        await talentsArchiveSeeder(payload)
        console.log('')
        await postsArchiveSeeder(payload)
        console.log('')

        // Seed admin user
        let adminResult = { created: false, skipped: false, reset: false }
        try {
            adminResult = await adminSeeder(payload)
        } catch (error) {
            console.warn('⚠️ Admin seeding failed, continuing:', error)
        }
        console.log('')

        // Seed posts (articles + news + dance class announcements)
        const postsResult = await postsSeeder(payload)
        console.log('')

        // Seed form templates
        const formsResult = await formsSeeder(payload)
        console.log('')

        // Seed full website content (all pages DE/EN, globals)
        await fullContentSeeder(payload)
        console.log('')

        // Seed header/footer AFTER full content so page relations exist
        let headerResult: { created: boolean; skipped: boolean; failed?: boolean } = {
            created: false,
            skipped: false,
            failed: false,
        }
        try {
            headerResult = await headerSeeder(payload)
        } catch (error) {
            headerResult = { created: false, skipped: false, failed: true }
            console.warn('⚠️ Header seeding failed, continuing:', error)
        }
        console.log('')

        let footerResult: { created: boolean; skipped: boolean; failed?: boolean } = {
            created: false,
            skipped: false,
            failed: false,
        }
        try {
            footerResult = await footerSeeder(payload)
        } catch (error) {
            footerResult = { created: false, skipped: false, failed: true }
            console.warn('⚠️ Footer seeding failed, continuing:', error)
        }
        console.log('')

        // Seed global SEO defaults (meta/schema/robots/llms settings)
        await seoSeeder(payload)
        console.log('')

        // Seed remaining globals (ThemeSettings, CookieBanner, Notifications, SedcardSettings, FormSettings)
        await globalsSeeder(payload)
        console.log('')

        // Auto-link contact form to FormSettings so ContactBlock works out of the box
        try {
            const contactForms = await payload.find({
                collection: 'forms',
                where: { title: { equals: 'Kontakt / Allgemein' } },
                limit: 1,
            })
            if (contactForms.docs.length > 0) {
                await payload.updateGlobal({
                    slug: 'form-settings',
                    data: { contactForm: contactForms.docs[0].id },
                })
                console.log('  ✅ Linked contact form to FormSettings')
            }
        } catch {
            console.log('  ⚠️  Could not auto-link contact form to FormSettings')
        }
        console.log('')

        // Summary
        console.log('🎉 Seed completed!')
        console.log('')

        // Trigger cache revalidation
        console.log('🔄 Triggering cache revalidation...')
        try {
            // We use a small timeout and ignore errors because the dev server
            // might not be running during the seed process.
            const revalidateUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
            const secret = process.env.CRON_SECRET ? `?secret=${process.env.CRON_SECRET}` : ''
            const response = await fetch(`${revalidateUrl}/api/revalidate-nav${secret}`, {
                method: 'GET',
            })
            if (response.ok) {
                const result = await response.json()
                console.log('   ✅ Cache revalidated successfully:', result.tags.join(', '))
            } else {
                console.log('   ⚠️  Cache revalidation API returned status:', response.status)
            }
        } catch (_error) {
            console.log('   ℹ️  Cache revalidation skipped (server likely not running)')
        }

        console.log('')
        console.log('📋 Summary:')
        console.log(
            `   - Media: ${mediaResult.created} created, ${mediaResult.updated} updated (${mediaResult.total} total templates)`,
        )
        if (mediaResult.failed) {
            console.log('   - Media seeding was skipped due to runtime image/font limitations')
        }
        console.log(
            `   - Talents: ${talentsResult.created} created, ${talentsResult.updated ?? 0} updated (${talentsResult.total} total)`,
        )
        console.log(
            `   - Pages: ${pagesResult.created} created, ${pagesResult.skipped} skipped (home)`,
        )
        console.log('   - Talents Archive & Posts Archive: defaults set (DE)')
        console.log(
            `   - Admin User: ${adminResult.created ? 'created' : adminResult.skipped ? 'already exists' : 'failed'}`,
        )
        console.log(
            `   - Header: ${headerResult.created ? 'created' : headerResult.skipped ? 'already exists' : 'failed'}`,
        )
        console.log(
            `   - Footer: ${footerResult.created ? 'created' : footerResult.skipped ? 'already exists' : 'failed'}`,
        )
        console.log(
            `   - Posts: ${postsResult.created} created, ${postsResult.updated ?? 0} updated (${postsResult.total} total templates)`,
        )
        console.log(
            `   - Forms: ${formsResult.created} created, ${formsResult.skipped} skipped (${formsResult.total} templates)`,
        )
        console.log('   - SEO Global: defaults for meta/schema/robots seeded (DE/EN)')
        console.log('   - Globals: ThemeSettings, CookieBanner (DE/EN), Notifications, SedcardSettings, FormSettings')
        console.log('')
        console.log('🔐 Admin Login:')
        console.log('   Email: admin@deleyna.com')
        console.log('   Password: Admin123!')
        console.log('')

        process.exit(0)
    } catch (error) {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    }
}

// Run if called directly
seed()
