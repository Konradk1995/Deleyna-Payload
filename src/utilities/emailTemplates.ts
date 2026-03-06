const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

function wrapInLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background-color: #0a0a0a; color: #e5e5e5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .logo { text-align: center; margin-bottom: 32px; font-size: 24px; font-weight: 700; letter-spacing: 0.05em; color: #ffffff; }
    .card { background-color: #141414; border: 1px solid #262626; border-radius: 12px; padding: 32px; }
    h1 { font-size: 20px; font-weight: 600; margin: 0 0 16px; color: #ffffff; }
    p { font-size: 15px; line-height: 1.6; margin: 0 0 16px; color: #a3a3a3; }
    .btn { display: inline-block; padding: 12px 28px; background-color: #ffffff; color: #0a0a0a; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; margin: 8px 0 24px; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #525252; }
    .code { display: inline-block; background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 4px 12px; font-family: monospace; font-size: 14px; color: #e5e5e5; letter-spacing: 0.1em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">DELEYNA</div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Deleyna. Alle Rechte vorbehalten.
    </div>
  </div>
</body>
</html>`
}

interface VerifyEmailArgs {
  token: string
  user: { email: string; name?: string }
}

export function generateVerifyEmailHTML({ token, user }: VerifyEmailArgs): string {
  const verifyUrl = `${baseUrl}/api/users/verify/${token}`
  const greeting = user.name ? `Hallo ${user.name},` : 'Hallo,'

  return wrapInLayout(`
    <h1>E-Mail bestätigen</h1>
    <p>${greeting}</p>
    <p>Bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
    <a href="${verifyUrl}" class="btn">E-Mail bestätigen</a>
    <p>Oder kopiere diesen Link in deinen Browser:</p>
    <p style="word-break: break-all; font-size: 13px;">${verifyUrl}</p>
    <p>Falls du dieses Konto nicht erstellt hast, kannst du diese E-Mail ignorieren.</p>
  `)
}

interface ForgotPasswordArgs {
  token: string
  user: { email: string; name?: string }
}

export function generateForgotPasswordHTML({ token, user }: ForgotPasswordArgs): string {
  const resetUrl = `${baseUrl}/admin/reset/${token}`
  const greeting = user.name ? `Hallo ${user.name},` : 'Hallo,'

  return wrapInLayout(`
    <h1>Passwort zurücksetzen</h1>
    <p>${greeting}</p>
    <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den Button, um ein neues Passwort zu vergeben.</p>
    <a href="${resetUrl}" class="btn">Neues Passwort setzen</a>
    <p>Oder kopiere diesen Link in deinen Browser:</p>
    <p style="word-break: break-all; font-size: 13px;">${resetUrl}</p>
    <p>Dieser Link ist 1 Stunde gültig. Falls du keine Passwort-Zurücksetzung angefordert hast, kannst du diese E-Mail ignorieren.</p>
  `)
}
