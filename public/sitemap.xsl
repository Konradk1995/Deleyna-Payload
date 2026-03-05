<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="de">
      <head>
        <title>XML Sitemap – DELEYNA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #0a0a0a;
            color: #e5e5e5;
            line-height: 1.6;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 24px;
          }

          .header {
            margin-bottom: 48px;
          }

          .header h1 {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #fff;
            margin-bottom: 8px;
          }

          .header p {
            color: #737373;
            font-size: 15px;
          }

          .header .badge {
            display: inline-block;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 9999px;
            padding: 4px 14px;
            font-size: 13px;
            color: #a1a1aa;
            margin-top: 16px;
          }

          .stats {
            display: flex;
            gap: 32px;
            margin-bottom: 32px;
            flex-wrap: wrap;
          }

          .stat {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 20px 28px;
            min-width: 160px;
          }

          .stat-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #71717a;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #fff;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            overflow: hidden;
          }

          thead {
            background: #111113;
          }

          th {
            padding: 14px 20px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #71717a;
            border-bottom: 1px solid #27272a;
          }

          td {
            padding: 12px 20px;
            font-size: 14px;
            border-bottom: 1px solid #1e1e21;
          }

          tr:last-child td {
            border-bottom: none;
          }

          tr:hover td {
            background: #1c1c1f;
          }

          td a {
            color: #60a5fa;
            text-decoration: none;
            transition: color 0.15s;
          }

          td a:hover {
            color: #93bbfc;
            text-decoration: underline;
          }

          .priority-high { color: #4ade80; }
          .priority-mid { color: #facc15; }
          .priority-low { color: #71717a; }

          .freq {
            display: inline-block;
            background: #27272a;
            border-radius: 6px;
            padding: 2px 10px;
            font-size: 12px;
            color: #a1a1aa;
          }

          .alternates {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .alt-tag {
            display: inline-block;
            background: #27272a;
            border-radius: 4px;
            padding: 1px 8px;
            font-size: 11px;
            color: #a1a1aa;
            text-transform: uppercase;
          }

          .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #27272a;
            color: #52525b;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
          }

          @media (max-width: 768px) {
            .container { padding: 24px 16px; }
            .header h1 { font-size: 24px; }
            .stats { gap: 16px; }
            .stat { min-width: 120px; padding: 16px 20px; }
            .stat-value { font-size: 22px; }
            th, td { padding: 10px 12px; }
            table { font-size: 13px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DELEYNA – XML Sitemap</h1>
            <p>
              Diese Sitemap wird automatisch generiert und hilft Suchmaschinen, alle Seiten zu indexieren.
            </p>
            <span class="badge">
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
            </span>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-label">Gesamt URLs</div>
              <div class="stat-value">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </div>
            </div>
            <div class="stat">
              <div class="stat-label">Deutsch</div>
              <div class="stat-value">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc, '/de')])"/>
              </div>
            </div>
            <div class="stat">
              <div class="stat-label">English</div>
              <div class="stat-value">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc, '/en')])"/>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Lastmod</th>
                <th>Freq</th>
                <th>Priority</th>
                <th>Alternates</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                  <td>
                    <xsl:if test="sitemap:changefreq">
                      <span class="freq">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </xsl:if>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt;= 0.8">
                        <span class="priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt;= 0.5">
                        <span class="priority-mid"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td>
                    <div class="alternates">
                      <xsl:for-each select="xhtml:link[@rel='alternate']">
                        <span class="alt-tag">
                          <xsl:value-of select="@hreflang"/>
                        </span>
                      </xsl:for-each>
                    </div>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <div class="footer">
            <span>Generiert von DELEYNA Payload CMS</span>
            <span>
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs indexiert
            </span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
