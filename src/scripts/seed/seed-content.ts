/**
 * Seed pages + header (upsert — safe to re-run on existing DB)
 *
 * Usage: npx tsx src/scripts/seed/seed-content.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config'
import { formsSeeder } from './seeders/forms.seeder'
import { fullContentSeeder } from './seeders/fullContent.seeder'
import { headerSeeder } from './seeders/header.seeder'
import { footerSeeder } from './seeders/footer.seeder'
import { jobsArchiveSeeder } from './seeders/jobsArchive.seeder'

async function run() {
    console.log('📋 Seeding forms + pages + header + footer...')
    console.log('')

    try {
        const payload = await getPayload({ config })
        console.log('✅ Connected to database')
        console.log('')

        // Seed forms first so contact/booking blocks can reference them
        await formsSeeder(payload)
        console.log('')

        await fullContentSeeder(payload)
        console.log('')

        await headerSeeder(payload)
        console.log('')

        await footerSeeder(payload)
        console.log('')

        await jobsArchiveSeeder(payload)
        console.log('')

        console.log('🎉 Content + header + footer + jobs archive seeding completed!')
        process.exit(0)
    } catch (error) {
        console.error('❌ Seeding failed:', error)
        process.exit(1)
    }
}

run()
