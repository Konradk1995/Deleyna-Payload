import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

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

export async function GET(request: Request) {
    const payload = await getPayload({ config })

    // Auth check — only admin/editor
    const { user } = await payload.auth({ headers: request.headers })
    if (
        !user ||
        !(user.roles as string[])?.some((r: string) => ['admin', 'editor'].includes(r))
    ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await payload.find({
        collection: 'talents',
        limit: 500,
        depth: 1,
        draft: true,
        sort: 'sortOrder',
        locale: 'de',
    })

    // Fetch EN bios separately
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

    const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const categoryMap: Record<string, string> = {
        dancer: 'Dancer',
        model: 'Model',
        both: 'Dancer & Model',
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

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="talents-export-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
    })
}
