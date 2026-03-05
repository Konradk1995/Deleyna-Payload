import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
    buildTalentApplicationResult,
    extractSubmissionFields,
    formatApplicationValidationNotes,
} from '@/utilities/talentApplication'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    const payload = await getPayload({ config })

    // Auth check
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || !(user.roles as string[])?.some((r: string) => ['admin', 'editor'].includes(r))) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const { submissionId } = await req.json()
    if (!submissionId) {
        return NextResponse.json({ error: 'submissionId fehlt' }, { status: 400 })
    }

    // Fetch submission
    const submission = await payload.findByID({
        collection: 'form-submissions',
        id: submissionId,
        depth: 0,
        user,
        overrideAccess: false,
    })

    if (!submission) {
        return NextResponse.json({ error: 'Einsendung nicht gefunden' }, { status: 404 })
    }

    const sub = submission as unknown as Record<string, unknown>

    if (sub.category !== 'become_talent') {
        return NextResponse.json(
            { error: 'Nur "Talent werden"-Bewerbungen koennen genehmigt werden' },
            { status: 400 },
        )
    }

    if (sub.applicationStatus === 'approved' && sub.linkedTalent) {
        return NextResponse.json({ talentId: sub.linkedTalent })
    }

    const fields = extractSubmissionFields(sub.submissionData)
    const { talentData, validationWarnings } = buildTalentApplicationResult(fields, {
        publish: true,
        slugSuffix: String(submissionId),
    })
    const locale = sub.locale === 'en' ? 'en' : 'de'

    try {
        const talent = await payload.create({
            collection: 'talents',
            data: talentData,
            locale,
            draft: false,
            user,
            overrideAccess: false,
        })

        await payload.update({
            collection: 'form-submissions',
            id: submissionId,
            data: {
                applicationStatus: 'approved',
                linkedTalent: talent.id,
                applicationValidationNotes: formatApplicationValidationNotes(validationWarnings),
            } as Record<string, unknown>,
            user,
            overrideAccess: false,
        })

        return NextResponse.json({ talentId: talent.id })
    } catch (err) {
        console.error('Fehler beim Erstellen des Talents:', err)
        return NextResponse.json(
            { error: 'Talent konnte nicht erstellt werden' },
            { status: 500 },
        )
    }
}
