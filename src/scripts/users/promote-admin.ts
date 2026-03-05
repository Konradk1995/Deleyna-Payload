import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config'

async function promoteAdmin() {
    const email = process.argv[2]?.trim().toLowerCase()
    const password = process.argv[3]

    if (!email) {
        console.error('Usage: pnpm exec tsx src/scripts/users/promote-admin.ts <email> [newPassword]')
        process.exit(1)
    }

    const payload = await getPayload({ config })

    const userResult = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
    })

    const existing = userResult.docs[0]
    if (!existing) {
        console.error(`User not found: ${email}`)
        process.exit(1)
    }

    await payload.update({
        collection: 'users',
        id: existing.id,
        data: {
            roles: ['admin'],
            ...(password ? { password } : {}),
            loginAttempts: 0,
            lockUntil: null,
        },
    })

    console.log(`✅ Promoted to admin: ${email}`)
    if (password) {
        console.log('✅ Password updated')
    }
}

promoteAdmin().catch((error) => {
    console.error('❌ Failed to promote admin:', error)
    process.exit(1)
})
