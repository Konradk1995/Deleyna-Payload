/**
 * Seed only form templates (upsert — safe to re-run)
 *
 * Usage: npx tsx src/scripts/seed/seed-forms.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config'
import { formsSeeder } from './seeders/forms.seeder'

async function run() {
    console.log('📋 Seeding form templates...')
    console.log('')

    try {
        const payload = await getPayload({ config })
        console.log('✅ Connected to database')
        console.log('')

        const result = await formsSeeder(payload)

        console.log('')
        console.log('🎉 Forms seeding completed!')
        console.log(
            `   - ${result.created} created, ${result.skipped} skipped (${result.total} templates)`,
        )
        console.log('')

        process.exit(0)
    } catch (error) {
        console.error('❌ Forms seeding failed:', error)
        process.exit(1)
    }
}

run()
