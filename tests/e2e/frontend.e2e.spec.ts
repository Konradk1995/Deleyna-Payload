import { test, expect } from '@playwright/test'

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
    const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        const body = document.body
        const maxWidth = Math.max(doc.scrollWidth, body?.scrollWidth ?? 0)
        return {
            viewportWidth: window.innerWidth,
            scrollWidth: maxWidth,
            hasOverflow: maxWidth > window.innerWidth + 1,
        }
    })

    expect(
        overflow.hasOverflow,
        `Expected no horizontal overflow. viewport=${overflow.viewportWidth}, scrollWidth=${overflow.scrollWidth}`,
    ).toBe(false)
}

async function gotoPath(page: import('@playwright/test').Page, path: string) {
    let lastError: unknown
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 120000 })
            await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
            return
        } catch (error) {
            lastError = error
            await page.waitForTimeout(1500)
        }
    }
    throw lastError
}

test.describe('Frontend – kritische Pfade (Deleyna)', () => {
    test.describe.configure({ timeout: 240000 })

    test('Health-API: GET /api/health liefert 200 und status ok', async ({ request }) => {
        const res = await request.get('/api/health')
        expect(res.status()).toBe(200)
        const body = await res.json()
        expect(body).toHaveProperty('status', 'ok')
        expect(body).toHaveProperty('timestamp')
        expect(body).toHaveProperty('database')
        expect(body.database).toHaveProperty('connected', true)
    })

    test('Admin: /admin ohne Login zeigt Login-Seite oder Redirect', async ({ page }) => {
        await page.goto('/admin', { waitUntil: 'domcontentloaded', timeout: 15000 })
        await expect(page).toHaveURL(/\/admin(\/)?$/)
        const loginForm = page.locator('form').filter({ has: page.locator('input[type="password"]') })
        const loginHeading = page.getByRole('heading', { name: /log in|sign in|anmelden/i })
        await expect(loginForm.or(loginHeading)).toBeVisible({ timeout: 5000 })
    })

    test('Home: Locale-Redirect und Hauptinhalt', async ({ page }) => {
        await gotoPath(page, '/')
        // Middleware leitet auf /de oder /en um
        await expect(page).toHaveURL(/\/(de|en)(\/)?$/)
        // Hauptinhalt oder 404 (wenn keine Home-Page im CMS)
        const main = page.locator('main#main-content')
        const notFound = page.getByRole('heading', { name: /not found|404/i })
        await expect(main.or(notFound)).toBeVisible({ timeout: 10000 })
    })

    test('Home (DE): Seite lädt', async ({ page }) => {
        await gotoPath(page, '/de')
        await expect(page).toHaveURL(/\/de(\/)?$/)
        await expect(page.locator('main#main-content').or(page.getByText('Not Found'))).toBeVisible(
            {
                timeout: 10000,
            },
        )
    })

    test('Talents-Liste: DE (/de/talente) lädt', async ({ page }) => {
        await gotoPath(page, '/de/talente')
        await expect(page).toHaveURL(/\/de\/talente$/)
        await expect(page.locator('main#main-content')).toBeVisible({ timeout: 10000 })
        const main = page.locator('main')
        await expect(main).toBeVisible()
    })

    test('Talents-Liste: EN (/en/talents) lädt', async ({ page }) => {
        await gotoPath(page, '/en/talents')
        await expect(page).toHaveURL(/\/en\/talents$/)
        await expect(page.locator('main#main-content')).toBeVisible({ timeout: 10000 })
    })

    test('Talent-Detail: erste Talent-URL wenn vorhanden', async ({ page }) => {
        await gotoPath(page, '/de/talente')
        await expect(page.locator('main#main-content')).toBeVisible({ timeout: 10000 })
        const talentLink = page.locator('main a[href*="/talente/"]').first()
        const count = await talentLink.count()
        if (count > 0) {
            const href = await talentLink.getAttribute('href')
            if (href) {
                await gotoPath(page, href)
            } else {
                await talentLink.click()
            }
            await expect(page).toHaveURL(/\/de\/talente\/[^/]+$/)
            await expect(page.locator('main#main-content')).toBeVisible({ timeout: 5000 })
        }
    })

    test('Blog-Liste: DE (/de/magazin) lädt', async ({ page }) => {
        await gotoPath(page, '/de/magazin')
        await expect(page).toHaveURL(/\/de\/magazin$/)
        await expect(page.locator('main#main-content')).toBeVisible({ timeout: 10000 })
    })

    test('Blog-Liste: EN (/en/blog) lädt', async ({ page }) => {
        await gotoPath(page, '/en/blog')
        await expect(page).toHaveURL(/\/en\/blog$/)
        await expect(page.locator('main#main-content')).toBeVisible({ timeout: 10000 })
    })

    test('Contact: Abschnitt oder Block erreichbar', async ({ page }) => {
        await gotoPath(page, '/de')
        await expect(page.locator('main#main-content').or(page.getByText('Not Found'))).toBeVisible(
            {
                timeout: 10000,
            },
        )
        const contactSection = page.locator('#contact, section#contact')
        const count = await contactSection.count()
        if (count > 0) {
            await expect(contactSection.first()).toBeVisible()
            const form = page.locator('form')
            if ((await form.count()) > 0) {
                await expect(form.first()).toBeVisible()
            }
        }
    })

    test('Layout-Landmarks vorhanden (Header/Main/Footer)', async ({ page }) => {
        await gotoPath(page, '/de')
        await expect(page.locator('header').first()).toBeVisible()
        const main = page.locator('main#main-content')
        await expect(main).toHaveAttribute('id', 'main-content')
        await expect(page.locator('footer').first()).toBeVisible()
    })

    test('Responsive: keine horizontale Side-Scroll auf Kernrouten', async ({ page }) => {
        const viewports = [
            { width: 375, height: 812 },
            { width: 768, height: 1024 },
            { width: 1280, height: 800 },
        ]
        const routes = ['/de', '/de/talente']

        for (const route of routes) {
            await gotoPath(page, route)
            await expect(page.locator('main#main-content')).toBeVisible({ timeout: 10000 })

            for (const viewport of viewports) {
                await page.setViewportSize(viewport)
                await page.waitForTimeout(200)
                await expectNoHorizontalOverflow(page)
            }
        }
    })

    test('Mobile Header: Menü öffnet/schließt und bleibt ohne Side-Scroll', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 })
        await gotoPath(page, '/de')

        const openMenuButton = page.getByRole('button', { name: /open menu/i }).first()
        await expect(openMenuButton).toBeVisible({ timeout: 10000 })
        await openMenuButton.click()

        const closeMenuButton = page.getByRole('button', { name: /close menu/i }).first()
        await expect(closeMenuButton).toBeVisible()
        await expectNoHorizontalOverflow(page)

        await closeMenuButton.click({ force: true })
        await expect(page.getByRole('button', { name: /open menu/i }).first()).toBeVisible()
        await expectNoHorizontalOverflow(page)
    })
})
