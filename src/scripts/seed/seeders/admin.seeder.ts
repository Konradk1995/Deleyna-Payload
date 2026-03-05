import type { Payload } from 'payload'

export async function adminSeeder(payload: Payload) {
    console.log('📦 Seeding admin user...')

    try {
        // --- Deleyna Admin ---
        const existingDeleynaAdmin = await payload.find({
            collection: 'users',
            where: {
                email: { equals: 'admin@deleyna.com' },
            },
        })

        if (existingDeleynaAdmin.docs.length > 0) {
            await payload.update({
                collection: 'users',
                id: existingDeleynaAdmin.docs[0].id,
                data: {
                    name: 'Deleyna Admin',
                    email: 'admin@deleyna.com',
                    password: 'Admin123!',
                    roles: ['admin'],
                    loginAttempts: 0,
                    lockUntil: null,
                },
            })
            console.log('  ✅ Reset existing admin user credentials: admin@deleyna.com / Admin123!')
        } else {
            await payload.create({
                collection: 'users',
                data: {
                    name: 'Deleyna Admin',
                    email: 'admin@deleyna.com',
                    password: 'Admin123!',
                    roles: ['admin'],
                },
            })
            console.log('  ✅ Created admin user: admin@deleyna.com / Admin123!')
        }

        return { created: true, skipped: false, reset: true }
    } catch (error) {
        console.error('  ❌ Error creating admin user:', error)
        throw error
    }
}
