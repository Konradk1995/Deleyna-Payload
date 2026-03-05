# Block- & Section-Standards

Best Practices für Blöcke und Sektionen in diesem Projekt. **Bei neuen oder geänderten Blöcken einhalten.** Einheitliche Struktur, Performance und Wiederverwendbarkeit (angelehnt an weess-payload-init).

---

## 0. Theme & Farben (Quick Reference)

- **Farben:** Nur Design-Tokens – `bg-background`, `text-foreground`, `text-muted-foreground`, `text-primary`, `bg-card`, `border-border`, `bg-accent`, `text-accent-foreground`, `bg-accent-hover`, `bg-secondary`, `ring-ring`, `bg-muted`, `bg-destructive`, `text-success`, `text-destructive` usw. Keine Hex-Werte oder `bg-white` in Komponenten.
- **CSS-Variablen:** Alle Tokens in `src/app/(frontend)/globals.css` (`:root` + `.dark`). Tailwind nutzt sie über `tailwind.config.ts` → `theme.extend.colors`.
- **Dark Mode:** Über Klasse `.dark` am `<html>` (ThemeToggle + Init-Script im Layout). Blöcke nutzen nur Tokens – kein `isDarkMode`/Theme-Check für Farben.
- **On-Media-Kontrast:** Für Text/Overlays auf Bild/Video nur `text-on-media`, `text-on-media-muted`, `bg-media-overlay`/`from-media-overlay` und `hero-overlay` nutzen. Keine harten `text-white/bg-black` Klassen.

## 0.1 Typography-Utilities

- **Headlines:** `font-heading-1-bold` (Hero) … `font-heading-6-bold` (kleine Überschriften). Section-Headlines: `font-heading-3-bold`, Karten-Titel: `font-heading-5-bold`.
- **Fließtext:** `font-normal-text-regular`, `font-medium-text-regular`, `font-small-text-regular`, `font-small-text-bold`, `font-subtext-semibold`.
- **Beispiel Section-Header:** `className="font-heading-3-bold text-foreground"`, Subtitle: `className="font-normal-text-regular text-muted-foreground md:font-medium-text-regular"`.
- **⚠ Keine Breakpoint-Overrides:** Nie `sm:text-2xl`, `md:text-4xl` o.ä. neben Typography-Tokens setzen – die Token-Klassen nutzen intern `clamp()` und sind bereits responsive.
- **H2-Schema (verbindlich):** Pro Block genau **eine** primäre `<h2>` (Section-Headline). Untergeordnete Titel in Cards/Items als `<h3>`/`<h4>`.
- **Anti-Clipping für Headlines:** Für große Headlines immer `font-display-tight`, `tracking-tight`, `text-balance`, `hyphens-auto`, `[overflow-wrap:anywhere]` und kleines Bottom-Padding (`pb-[0.03em]` bis `pb-[0.04em]`) nutzen, damit keine Glyphen abgeschnitten werden.

---

## 1. Der „perfekte“ Block (Struktur)

Jeder Block soll leicht wartbar, performant und konsistent sein.

### 1.1 Dateistruktur

- **Config:** `src/blocks/<BlockName>/config.ts` – Payload-Block-Definition (slug, labels, fields).
- **Component:** `src/blocks/<BlockName>/Component.tsx` – Server Component, rendert den Block.
- **Optional:** `Component.client.tsx` nur wenn Client-Logik nötig (State, motion, Events). Keine doppelten Reveal-Implementierungen – **ScrollFadeIn** einmal nutzen.

### 1.1.1 Block-Katalog (Core vs Extended)

- **Core-Katalog:** `src/blocks/core.ts`  
  Enthält wiederverwendbare Kernblöcke (z. B. Content, Form, Slider, InfoCards, Legal).
- **Extended-Katalog:** `src/blocks/extended.ts`  
  Enthält domain-/kampagnenspezifische Erweiterungen (z. B. Services, FeaturedTalents, Team, Schedule).
- **Compose:** `src/blocks/index.ts` exportiert `allBlocks = [...coreBlocks, ...extendedBlocks]`.
- **Regel:** Neue Blöcke immer zuerst entscheiden: `core` (breit wiederverwendbar) oder `extended` (spezifisch).

### 1.2 Pflichtfelder pro Block (Payload-Config)

| Feld | Zweck | Beispiel |
|------|--------|----------|
| `imageURL` | Admin-Vorschau in der Block-Liste | `'/api/media/file/cta-block-preview.svg'` |
| `imageAltText` | A11y für Block-Vorschau | `'CTA Block'` |
| `backgroundColor` | Section-Hintergrund (wo sinnvoll) | `white` \| `muted` (Select) |
| Section-Header | Einheitliche Reihenfolge (s. Abschnitt 2) | overline → title → titleHighlight → description → CTA |

### 1.2.1 Hero: Überschrift (H1) & Subtext

- Im Page-Hero (Globals/Pages) gibt es optionale Felder **Überschrift (H1)** und **Untertitel / Subtext** – einfache Alternative zum Rich-Text für die Hauptzeile. Wenn gesetzt, werden sie als `<h1>` und `<p>` ausgegeben; zusätzlich kann Rich-Text für weiteren Inhalt genutzt werden.
- **Video-Hero:** MP4/WebM als Hintergrundvideo (Upload oder externe URL); `getMediaUrl` + korrekter `type` (video/mp4 oder video/webm).
- **Hero-CTAs:** Standardisiert als erstes `primary`, zweites `outline` (lesbarer Kontrast auf Media in Light/Dark). `secondary` im Hero vermeiden.

### 1.3 Section-Wrapper

- **Abstände:** Nur Design-Token-Klassen aus `globals.css` – **`.section-padding`** (Standard) oder **`.section-padding-lg`** (größere Sektion). Werte steuerbar über CSS-Variablen `--section-padding-y`, `--section-padding-y-md`, `--section-padding-lg-y`, `--section-padding-lg-y-md` in `:root` – eine Stelle zum Anpassen für alle Blöcke.
- **Container:** `container` (Tailwind), ggf. `max-w-*` je nach Layout.
- **Hintergrund:** Aus CMS – z. B. `backgroundColor === 'muted'` → `bg-muted`, sonst `bg-background`.
- **Overflow-Safety:** Bei dekorativen absoluten Elementen (Blobs, Glows mit negativem Offset) immer `section-atmosphere` oder `overflow-x-clip` nutzen, damit kein horizontaler Scroll entsteht.

### 1.4 Performance

- **Serialization:** Schwere Payload-Daten vor dem Übergeben an Client Components strippen – `serializeTalentForCard`, `serializePostForCard` aus `@/utilities/serialize`.
- **Reveal:** Nur **ScrollFadeIn** (respektiert `prefers-reduced-motion`). Keine zusätzlichen motion-Reveals pro Block.
- **Medien:** **Media**-Komponente aus `@/components/Media`; `sizes` und `priority` sinnvoll setzen für LCP.

---

## 2. Section-Header (Reihenfolge)

Einheitliche Reihenfolge der Felder für Sektionen:

1. **Overline/Badge** (optional)
2. **Title/Headline** (optional)
3. **TitleHighlight** (optional) – Teilstück der Headline in Akzentfarbe
4. **Description/Subtitle** (optional)
5. **CTA/Link** (optional)

**Komponente:** **SectionHeader** mit `overline`, `title`, `titleHighlight`, `description`. Headline-Highlight über **renderHighlightedHeadline(title, titleHighlight)** – der Highlight-Span nutzt **`text-accent`** (Copper), **nicht** `text-primary` (das wäre weiß auf weiß im Dark Mode).

---

## 3. Wiederverwendbare UI: Card & Button

- **Card:** `@/components/ui/card` – **Card**, **CardHeader**, **CardTitle**, **CardDescription**, **CardContent**, **CardFooter**, **CardImage**, **CardBadge**. Varianten: `default`, `elevated`, `interactive`. Nur Design-Tokens und Typography-Utilities.
- **Button:** `@/components/ui/button` – **Button** mit **buttonVariants** (variant: primary, secondary, accent, outline, ghost, link, muted, destructive; size: xs, sm, default, lg, icon, clear). CTAs in Blöcken immer über **Button** oder **CMSLink** mit passender `appearance`.

Blöcke und Sektionen sollen diese Bausteine nutzen, damit das Projekt leicht umstellbar und konsistent bleibt.

---

## 4. Motion / Animationen

- **Library:** `motion` (Import: `from 'motion/react'`).
- **Reveal:** Nur **ScrollFadeIn** verwenden. Respektiert `prefers-reduced-motion` (A11y, Lighthouse).
- **Varianten:** `animation`: `'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right'`; optional `delay` in ms.

---

## 5. Styling

- **Farben:** Nur Theme-Tokens (inkl. `text-success`, `text-destructive` für Feedback). Keine festen Hex-Werte oder `bg-white`/`text-gray-500` in Blöcken.
- **Theme-Logik:** Keine `dark:`-Color-Overrides in Block-/Hero-Komponenten. Light/Dark ausschließlich über CSS-Variablen/Tokens.
- **Abstände:** Section nur **`.section-padding`** oder **`.section-padding-lg`** (Token-Klassen); Header-Bereich z. B. `mb-8 md:mb-12`.
- **Klassen:** Immer **cn()** aus `@/utilities/ui` für bedingte Klassen.

### 5.1 Hero & Slider Utilities

- **Hero-Overlay:** `.hero-overlay` (nutzt `--media-overlay` + `--hero-overlay-opacity`). Kein `bg-black/50`.
- **Hero-Divider:** `.hero-divider` (Kupfer-Gradient-Linie).
- **Slider Ambient:** `.slider-ambient-glow` (CSS-only `box-shadow` mit `--copper` Token).
- **Selection/Favoriten auf Media:** In Komponenten `AddToSelectionButton` mit `tone="onMedia"` nutzen (kein manuelles Klassenduplikat pro Block).
- **Slider-Section-Hintergrund:** Keine erzwungene Dark-Section in Light-Theme. Wrapper token-basiert (`bg-background` + `section-atmosphere`), Dark-Feeling kommt über Media/Overlay.

### 5.2 Masonry-Kontrast-Schema

- **Media-Karten:** Sobald `backgroundMedia` vorhanden ist, Textfläche zusätzlich als Surface rendern (`tone.contentSurface`) für stabile Lesbarkeit.
- **Tone-Regel:** Für bildbasierte Audience-Karten immer On-Media-Text priorisieren (keine dunkle Typo auf Fotos).
- **Side-Panel in Video/Media-Card:** Keine harte Split-Gradient-Naht. Stattdessen tokenisierte, weiche Flächen (`bg-media-overlay/...` oder `bg-background/...` + `backdrop-blur`).
- **Overlay-Intensität:** Für Text auf Media mindestens mittlere Dichte (`media-overlay >= 0.6` im Mittelbereich), damit H2/H3 und Body in Light/Dark konsistent lesbar bleiben.

---

## 6. Links & Medien

- **Links:** Einheitlich **CMSLink** oder **Button** (asChild für Links). Feld über **link()** aus `@/fields/link` (reference/custom/archive, newTab, label).
- **Tracking:** In Seeds standardmäßig **aus** lassen. Tracking (`trackClicks`, optional `trackingEventName`) wird bei Bedarf pro Link im CMS aktiviert.
- **Medien:** **Media** aus `@/components/Media` (kein eigenes `<img>` in Blöcken).

---

## 7. Globals (Header/Footer)

- **Laden:** `getHeader(locale)` / `getFooter(locale)` aus `@/utilities/getGlobals` (Cache-Tags).
- **Revalidate:** Hooks rufen `revalidateTag(\`global_header_${code}\`)` bzw. `global_footer_${code}` für alle Locales auf.

---

## 8. Locale & A11y

- **Locale:** `resolveLocale(locale)` und optional `withLocalePath(path, locale)` aus `@/utilities/locale`.
- **Skip-to-Content:** Link „Zum Inhalt springen“ im Layout; `<main id="main-content">` für Fokus-Ziel.

---

## 9. Kurz-Checkliste für neue Blöcke

- [ ] Block-Config: `imageURL` + `imageAltText` gesetzt
- [ ] Section: `backgroundColor` (white/muted) wo sinnvoll
- [ ] Block-Ordner: `Component.tsx` (ggf. `Component.client.tsx`)
- [ ] Reveal nur über **ScrollFadeIn**
- [ ] Section-Header: **SectionHeader** (overline → title → titleHighlight → description)
- [ ] Typo: `font-heading-*`, `font-normal-text-*`, `font-small-text-*`, `font-subtext-semibold` – **keine** `text-xl`/`text-2xl` neben Tokens
- [ ] Highlight: **text-accent** (nicht text-primary)
- [ ] UI: **Card** / **Button** aus `@/components/ui` wo passend
- [ ] Klassen mit **cn()**, nur Design-Tokens
- [ ] Links über **CMSLink** bzw. **Button**, Medien über **Media**
- [ ] Client Components: nur serialisierte, schlanke Daten (siehe `serialize.ts`)

## 10. Admin-Schema (Übersichtlichkeit)

- **Tone-Felder:** Bei Karten mit `backgroundMedia` im Admin keine dunkle Typo erzwingen; Standard soll auf lesbares On-Media gehen.
- **Button-Styles:** Für Selection/Favoriten in Media-Blöcken keine freie Klassenwahl im CMS, sondern feste Appearance-Regel aus Komponenten.
- **Block-Felder gruppieren:** Header-Felder zuerst (badge/title/highlight/description), dann Card-Content, dann Link/CTA, dann Styling/Tone.
- **Lokalisierung:** Optionen für sichtbare Labels (z. B. Hair/Eyes) immer als locale-spezifische Ausgabe rendern; CMS-Werte bleiben codes (`brown`, `blue`, ...).
