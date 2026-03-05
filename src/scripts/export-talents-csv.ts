/**
 * Export all talents as CSV for Notion import.
 *
 * Run: pnpm tsx src/scripts/export-talents-csv.ts
 * Output: talents-export.csv (in project root)
 *
 * Then import this CSV into Notion:
 * 1. Open your Notion database
 * 2. Click "..." → "Merge with CSV"
 * 3. Upload the CSV file
 */

import 'dotenv/config'
import { writeFileSync } from 'fs'
import { getPayload } from 'payload'
import config from '../payload.config'

function escapeCsv(value: unknown): string {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

function parseMeasurement(value?: string): string {
    if (!value) return ''
    const parsed = Number.parseFloat(value.replace(/,/g, '.').replace(/[^0-9.]/g, ''))
    return Number.isFinite(parsed) ? String(parsed) : ''
}

async function main() {
    console.log('📊 Exporting talents to CSV...')

    const payload = await getPayload({ config })

    // Fetch all talents (published + drafts)
    const result = await payload.find({
        collection: 'talents',
        limit: 500,
        depth: 1, // resolve skills
        draft: true,
        sort: 'sortOrder',
        locale: 'de',
    })

    // Also fetch EN bios
    const enResult = await payload.find({
        collection: 'talents',
        limit: 500,
        depth: 0,
        draft: true,
        sort: 'sortOrder',
        locale: 'en',
    })
    const enBioMap = new Map<number, string>()
    for (const doc of enResult.docs) {
        enBioMap.set(doc.id, typeof doc.bio === 'string' ? doc.bio : '')
    }

    const headers = [
        'Name',
        'Category',
        'Status',
        'Payload ID',
        'Slug',
        'Featured',
        'Sort Order',
        'Height',
        'Bust',
        'Waist',
        'Hips',
        'Shoe Size',
        'Clothing Size',
        'Hair',
        'Eyes',
        'Skills',
        'Languages',
        'Booking Email',
        'Instagram',
        'TikTok',
        'Website',
        'Bio DE',
        'Bio EN',
        'Profile URL',
    ]

    const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    const categoryMap: Record<string, string> = {
        dancer: 'Dancer',
        model: 'Model',
        both: 'Dancer & Model',
    }

    const rows = result.docs.map((doc) => {
        const m = doc.measurements as
            | {
                  height?: string
                  bust?: string
                  waist?: string
                  hips?: string
                  shoeSize?: string
                  confectionSize?: string
                  hair?: string[]
                  eyes?: string[]
              }
            | undefined

        const social = doc.socialMedia as
            | { instagram?: string; tiktok?: string; website?: string }
            | undefined

        const skills = Array.isArray(doc.skills)
            ? doc.skills
                  .map((s: unknown) => {
                      if (typeof s === 'object' && s !== null && 'title' in s)
                          return (s as { title?: string }).title
                      return null
                  })
                  .filter(Boolean)
                  .join(', ')
            : ''

        const languages = Array.isArray(doc.languages) ? doc.languages.join(', ') : ''

        return [
            doc.name || '',
            categoryMap[doc.category || 'both'] || 'Dancer & Model',
            doc._status === 'published' ? 'Published' : 'Draft',
            doc.id,
            doc.slug || '',
            doc.featured ? 'Yes' : 'No',
            doc.sortOrder ?? 0,
            parseMeasurement(m?.height),
            parseMeasurement(m?.bust),
            parseMeasurement(m?.waist),
            parseMeasurement(m?.hips),
            m?.shoeSize || '',
            m?.confectionSize || '',
            Array.isArray(m?.hair) ? m.hair.join(', ') : '',
            Array.isArray(m?.eyes) ? m.eyes.join(', ') : '',
            skills,
            languages,
            doc.bookingEmail || '',
            social?.instagram || '',
            social?.tiktok || '',
            social?.website || '',
            typeof doc.bio === 'string' ? doc.bio : '',
            enBioMap.get(doc.id) || '',
            doc.slug ? `${siteUrl}/de/talente/${doc.slug}` : '',
        ].map(escapeCsv)
    })

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    const outputPath = 'talents-export.csv'
    writeFileSync(outputPath, csv, 'utf-8')

    console.log(`✅ Exported ${result.docs.length} talents to ${outputPath}`)
    console.log('')
    console.log('📋 Notion Import:')
    console.log('   1. Open your Notion database')
    console.log('   2. Click "..." → "Merge with CSV"')
    console.log('   3. Upload talents-export.csv')

    process.exit(0)
}

main().catch((error) => {
    console.error('❌ Export failed:', error)
    process.exit(1)
})
