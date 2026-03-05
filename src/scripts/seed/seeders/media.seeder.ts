import fs from 'node:fs/promises'
import path from 'node:path'

import type { Payload } from 'payload'
import sharp from 'sharp'

type MediaSeedAsset = {
    filename: string
    alt: string
    caption: string
    gradientA: string
    gradientB: string
    accent: string
}

const CUTOUT_ASSET = {
    filename: 'seed-cutout-talent-01.png',
    alt: 'Freigestellte Tänzerin auf transparentem Hintergrund',
    caption: 'Cutout talent test',
}

const ASSETS: MediaSeedAsset[] = [
    {
        filename: 'seed-editorial-01.jpg',
        alt: 'Editorial dance portrait with copper lighting',
        caption: 'Editorial portrait',
        gradientA: '#0A0A0D',
        gradientB: '#5E3A1F',
        accent: '#C58A55',
    },
    {
        filename: 'seed-editorial-02.jpg',
        alt: 'Studio movement silhouette with warm highlights',
        caption: 'Studio movement',
        gradientA: '#111317',
        gradientB: '#3A2A1C',
        accent: '#D09A66',
    },
    {
        filename: 'seed-editorial-03.jpg',
        alt: 'Fashion portrait in monochrome and copper tones',
        caption: 'Fashion portrait',
        gradientA: '#171717',
        gradientB: '#4A3021',
        accent: '#B77B46',
    },
    {
        filename: 'seed-editorial-04.jpg',
        alt: 'Dance rehearsal atmosphere with cinematic glow',
        caption: 'Rehearsal atmosphere',
        gradientA: '#0F0F12',
        gradientB: '#503626',
        accent: '#D7A06B',
    },
    {
        filename: 'seed-editorial-05.jpg',
        alt: 'Premium talent profile backdrop with copper gradients',
        caption: 'Talent profile',
        gradientA: '#1A1C20',
        gradientB: '#5B3C2A',
        accent: '#C9915E',
    },
    {
        filename: 'seed-editorial-06.jpg',
        alt: 'Minimal studio scene with textured copper accents',
        caption: 'Minimal studio',
        gradientA: '#0D1015',
        gradientB: '#433024',
        accent: '#C88752',
    },
    {
        filename: 'seed-editorial-07.jpg',
        alt: 'Dramatic fashion silhouette with warm metallic tones',
        caption: 'Fashion silhouette',
        gradientA: '#121212',
        gradientB: '#5F412E',
        accent: '#D6A171',
    },
    {
        filename: 'seed-editorial-08.jpg',
        alt: 'Contemporary dance mood board visual',
        caption: 'Contemporary mood',
        gradientA: '#171A20',
        gradientB: '#62432E',
        accent: '#BD7E4A',
    },
]

function buildEditorialSvg(asset: MediaSeedAsset, index: number): string {
    const cx = 420 + (index % 3) * 220
    const cy = 760 + (index % 4) * 120
    const arcX = 1020 + (index % 2) * 160
    const arcY = 330 + (index % 3) * 90

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
  <defs>
    <linearGradient id="bg-${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${asset.gradientA}"/>
      <stop offset="100%" stop-color="${asset.gradientB}"/>
    </linearGradient>
    <radialGradient id="glow-${index}" cx="0.5" cy="0.5" r="0.55">
      <stop offset="0%" stop-color="${asset.accent}" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="${asset.accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur-${index}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="45" />
    </filter>
    <filter id="grain-${index}">
      <feTurbulence baseFrequency="0.75" numOctaves="2" seed="${45 + index}" type="fractalNoise"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.08"/>
      </feComponentTransfer>
    </filter>
  </defs>

  <rect width="1200" height="1600" fill="url(#bg-${index})"/>
  <ellipse cx="${cx}" cy="${cy}" rx="530" ry="450" fill="url(#glow-${index})" filter="url(#blur-${index})"/>
  <circle cx="${arcX}" cy="${arcY}" r="220" fill="${asset.accent}" opacity="0.23"/>
  <path d="M 120 1210 C 360 1060, 540 1360, 900 1170" stroke="${asset.accent}" stroke-width="2" opacity="0.42" fill="none"/>
  <path d="M 240 410 C 420 300, 640 580, 930 460" stroke="${asset.accent}" stroke-width="1.5" opacity="0.38" fill="none"/>
  <rect width="1200" height="1600" filter="url(#grain-${index})"/>
  <text x="74" y="1512" fill="${asset.accent}" fill-opacity="0.78" font-size="38" font-family="Arial, Helvetica, sans-serif" letter-spacing="4">DELEYNA</text>
</svg>
`.trim()
}

function buildCutoutTestSvg(): string {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="2000" viewBox="0 0 1200 2000">
  <defs>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#efb28f"/>
      <stop offset="100%" stop-color="#d38664"/>
    </linearGradient>
    <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#944f2f"/>
      <stop offset="100%" stop-color="#c87042"/>
    </linearGradient>
    <linearGradient id="suit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1f1617"/>
      <stop offset="100%" stop-color="#3a2326"/>
    </linearGradient>
  </defs>

  <g transform="translate(180,150)">
    <path d="M350 120c50 10 96 54 112 100 11 30 8 68-7 93-19 32-52 58-90 62-56 7-108-26-134-73-22-40-24-91-2-131 23-42 73-63 121-51z" fill="url(#skin)"/>
    <path d="M408 132c93 14 164 113 159 230-5 130-63 247-73 385-7 104 13 223-26 323-24 63-87 103-154 102-68-1-131-45-152-111-24-76-10-154 0-230 14-111 0-234 32-342 42-141 101-221 214-357z" fill="url(#hair)" opacity="0.92"/>
    <path d="M308 392c36-30 89-42 136-34 66 12 119 66 130 132 14 86-34 165-113 201-62 28-142 17-192-29-57-53-73-143-40-214 15-32 43-60 79-79z" fill="url(#skin)"/>
    <path d="M274 560c56-42 138-49 203-15 63 32 101 103 96 174-4 58-37 113-88 143-63 37-148 38-212 4-62-33-102-102-99-173 3-55 31-108 78-133z" fill="url(#suit)"/>
    <path d="M330 760c42-15 94-6 127 25 45 42 50 112 37 170-25 115-62 230-79 347-9 65-13 133 7 196 14 43 40 84 81 106 20 10 43 16 65 14 21-2 41-14 54-31 27-33 31-79 28-120-9-122-50-243-69-364-12-78-6-166 50-224 38-39 95-58 149-50 54 8 102 41 127 89 25 47 27 106 16 157-12 55-38 106-57 159-26 72-42 147-50 223-9 88-7 183-48 263-35 69-103 117-180 130-73 13-151-6-212-49-77-53-122-143-143-233-22-96-18-196-6-293 14-112 39-221 47-334 5-66 10-146 66-181z" fill="url(#skin)"/>
    <path d="M235 870c20-51 64-88 112-107 50-20 111-19 157 8 47 28 77 81 79 136 2 63-27 119-50 176-33 82-48 170-46 258 1 70 13 144 53 201 35 49 88 80 145 94 56 14 118 11 171-9 52-19 97-56 122-106 22-43 27-93 28-142 1-86-11-172-3-258 8-93 39-181 58-272 10-49 14-102-8-147-26-52-84-83-142-86-58-3-114 20-160 55-50 39-82 96-104 155-28 75-37 156-56 233-16 66-40 130-79 186-36 51-88 92-149 108-59 15-125 7-177-24-56-34-94-93-110-156-15-58-11-121 5-179 18-66 52-126 74-191 20-57 27-120 5-176-11-27-30-51-58-63-28-12-62-10-88 5-25 15-42 42-54 70z" fill="url(#suit)" opacity="0.95"/>
    <path d="M360 1658c18-44 67-68 113-57 45 11 77 56 74 102-2 37-24 71-56 90-40 24-94 20-130-12-35-31-45-84-24-123 6-11 14-21 23-30z" fill="#e8c9b8"/>
    <path d="M830 1688c21-41 70-62 114-49 48 14 78 64 70 113-8 47-49 84-96 90-56 7-110-30-126-84-7-24-5-50 4-70 8-18 20-34 34-47z" fill="#e8c9b8"/>
  </g>
</svg>
`.trim()
}

async function generateSeedAssets(targetDir: string): Promise<string[]> {
    await fs.mkdir(targetDir, { recursive: true })

    const outputPaths: string[] = []
    for (const [index, asset] of ASSETS.entries()) {
        const output = path.join(targetDir, asset.filename)
        const svg = buildEditorialSvg(asset, index)

        await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(output)

        outputPaths.push(output)
    }

    return outputPaths
}

async function generateCutoutAsset(targetDir: string): Promise<string> {
    await fs.mkdir(targetDir, { recursive: true })

    const output = path.join(targetDir, CUTOUT_ASSET.filename)
    const svg = buildCutoutTestSvg()

    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(output)

    return output
}

export async function mediaSeeder(payload: Payload) {
    console.log('📦 Seeding media library...')

    const seedDir = path.resolve(process.cwd(), 'media', 'seed-generated')
    const files = await generateSeedAssets(seedDir)
    const cutoutFile = await generateCutoutAsset(seedDir)

    let created = 0
    let updated = 0

    const ids: number[] = []

    for (const [index, filePath] of files.entries()) {
        const asset = ASSETS[index]

        const parsedPath = path.parse(asset.filename)
        const webpFilename = `${parsedPath.name}.webp`

        const existing = await payload.find({
            collection: 'media',
            where: {
                or: [
                    { filename: { equals: asset.filename } },
                    { filename: { equals: webpFilename } },
                ],
            },
            limit: 1,
            depth: 0,
        })

        if (existing.docs.length > 0) {
            const existingDoc = existing.docs[0]
            ids.push(existingDoc.id)

            await payload.update({
                collection: 'media',
                id: existingDoc.id,
                filePath,
                data: {
                    alt: asset.alt,
                    caption: asset.caption,
                },
                context: { disableRevalidate: true },
            })
            updated++
            continue
        }

        const createdDoc = await payload.create({
            collection: 'media',
            filePath,
            data: {
                alt: asset.alt,
                caption: asset.caption,
            },
            context: { disableRevalidate: true },
        })

        ids.push(createdDoc.id)
        created++
    }

    const cutoutParsed = path.parse(CUTOUT_ASSET.filename)
    const cutoutWebp = `${cutoutParsed.name}.webp`

    const existingCutout = await payload.find({
        collection: 'media',
        where: {
            or: [
                { filename: { equals: CUTOUT_ASSET.filename } },
                { filename: { equals: cutoutWebp } },
            ],
        },
        limit: 1,
        depth: 0,
    })

    if (existingCutout.docs.length > 0) {
        const existingDoc = existingCutout.docs[0]
        ids.push(existingDoc.id)

        await payload.update({
            collection: 'media',
            id: existingDoc.id,
            filePath: cutoutFile,
            data: {
                alt: CUTOUT_ASSET.alt,
                caption: CUTOUT_ASSET.caption,
            },
            context: { disableRevalidate: true },
        })
        updated++
    } else {
        const createdDoc = await payload.create({
            collection: 'media',
            filePath: cutoutFile,
            data: {
                alt: CUTOUT_ASSET.alt,
                caption: CUTOUT_ASSET.caption,
            },
            context: { disableRevalidate: true },
        })
        ids.push(createdDoc.id)
        created++
    }

    console.log(`  ✅ Media ready: ${created} created, ${updated} updated`)
    return { created, updated, total: ASSETS.length + 1, ids }
}
