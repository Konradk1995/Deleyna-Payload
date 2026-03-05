import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload | null = null
const runDBTests = process.env.RUN_DB_TESTS === '1'

const describeDB = runDBTests ? describe : describe.skip

describeDB('API', () => {
    beforeAll(async () => {
        const payloadConfig = await config
        payload = await getPayload({ config: payloadConfig })
    })

    it('fetches users', async () => {
        if (!payload) return
        const users = await payload.find({
            collection: 'users',
        })
        expect(users).toBeDefined()
    })
})
