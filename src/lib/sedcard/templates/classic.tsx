/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { Styles } from '@react-pdf/renderer'
import type { SedcardData, SedcardImageSource } from '../types'

/* ═══════════════════════════════════════════════════════
 *  DELEYNA SEDCARD — Asymmetric Grid Layout
 *  Landscape A4 · Editorial / High-Fashion feel
 *  Layout: Large hero left (55%) + asymmetric image grid
 *  + stats overlay strip at bottom
 * ═══════════════════════════════════════════════════════ */

const COPPER = '#C4956A'
const DARK = '#0A0A0B'
const MUTED = '#71717A'
const WARM_WHITE = '#FAF9F7'

// A4 landscape: 842 x 595 pt
const PAGE_W = 842
const PAGE_H = 595
const MARGIN = 0 // full-bleed images
const GUTTER = 5 // gap between images
const STATS_H = 130 // bottom info bar height
const IMG_AREA_H = PAGE_H - STATS_H // image area

const s = StyleSheet.create({
    /* ─── Page ─── */
    page: {
        backgroundColor: WARM_WHITE,
        fontFamily: 'Helvetica',
        color: DARK,
        width: PAGE_W,
        height: PAGE_H,
        position: 'relative',
    },

    /* ─── Top: Image grid area ─── */
    imageArea: {
        position: 'absolute',
        top: MARGIN,
        left: MARGIN,
        right: MARGIN,
        height: IMG_AREA_H,
        flexDirection: 'row',
    },

    /* Left column: hero image (55%) */
    heroCol: {
        width: '55%',
        height: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    heroPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EEECEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroPlaceholderText: {
        fontSize: 16,
        color: COPPER,
        letterSpacing: 6,
        textTransform: 'uppercase',
    },

    /* Right column: 2-3 stacked images (45%) */
    sideCol: {
        width: '45%',
        height: '100%',
        paddingLeft: GUTTER,
        flexDirection: 'column',
    },
    sideImgTop: {
        height: '50%',
        paddingBottom: GUTTER / 2,
    },
    sideImgBottom: {
        height: '50%',
        paddingTop: GUTTER / 2,
        flexDirection: 'row',
    },
    sideImgBottomLeft: {
        width: '50%',
        paddingRight: GUTTER / 2,
    },
    sideImgBottomRight: {
        width: '50%',
        paddingLeft: GUTTER / 2,
    },
    gridImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    gridPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EEECEA',
    },

    /* ─── Name overlay on hero ─── */
    nameOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 40,
        paddingBottom: 16,
        paddingLeft: 28,
        paddingRight: 28,
    },
    nameOverlayGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: 'rgba(10,10,11,0.55)',
    },
    talentName: {
        fontSize: 34,
        fontFamily: 'Helvetica-Bold',
        color: '#FFFFFF',
        lineHeight: 1.0,
        letterSpacing: 1,
        position: 'relative',
    },
    categoryLabel: {
        fontSize: 8,
        color: COPPER,
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
        position: 'relative',
    },

    /* ─── Bottom: Stats bar ─── */
    statsBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: STATS_H,
        backgroundColor: WARM_WHITE,
        flexDirection: 'row',
        paddingTop: 18,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
    },

    /* Stats bar: left section (measurements) */
    statsLeft: {
        width: '42%',
        paddingRight: 20,
    },
    sectionLabel: {
        fontSize: 7,
        color: COPPER,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 8,
    },
    measurementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    measurementItem: {
        width: '25%',
        marginBottom: 6,
    },
    measurementLabel: {
        fontSize: 5.5,
        color: MUTED,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 1,
    },
    measurementValue: {
        fontSize: 9.5,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
    },

    /* Stats bar: center section (skills + languages) */
    statsCenter: {
        width: '32%',
        paddingRight: 16,
        borderLeftWidth: 0.5,
        borderLeftColor: '#D4D4D8',
        paddingLeft: 20,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        marginBottom: 8,
    },
    tag: {
        fontSize: 7,
        color: DARK,
        backgroundColor: '#F0EFED',
        borderRadius: 3,
        paddingTop: 2.5,
        paddingRight: 7,
        paddingBottom: 2.5,
        paddingLeft: 7,
    },
    tagAccent: {
        fontSize: 7,
        color: COPPER,
        backgroundColor: '#FBF5F0',
        borderRadius: 3,
        paddingTop: 2.5,
        paddingRight: 7,
        paddingBottom: 2.5,
        paddingLeft: 7,
        fontFamily: 'Helvetica-Bold',
    },

    /* Stats bar: right section (agency) */
    statsRight: {
        width: '26%',
        borderLeftWidth: 0.5,
        borderLeftColor: '#D4D4D8',
        paddingLeft: 20,
        justifyContent: 'space-between',
    },
    agencyBlock: {},
    agencyLogo: {
        width: 32,
        height: 32,
        objectFit: 'contain',
        marginBottom: 4,
    },
    agencyName: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        letterSpacing: 0.5,
    },
    agencyContact: {
        fontSize: 6.5,
        color: MUTED,
        lineHeight: 1.5,
    },
    bookingLabel: {
        fontSize: 5.5,
        color: COPPER,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontFamily: 'Helvetica-Bold',
        marginTop: 6,
        marginBottom: 3,
    },

    /* Copper accent line at image/stats boundary */
    copperLine: {
        position: 'absolute',
        left: 32,
        right: 32,
        top: PAGE_H - STATS_H,
        height: 2,
        backgroundColor: COPPER,
    },

    /* Experience inline */
    expLine: {
        fontSize: 7,
        color: MUTED,
        lineHeight: 1.6,
    },
})

const CATEGORY_MAP: Record<string, Record<string, string>> = {
    de: { dancer: 'TÄNZER/IN', model: 'MODEL', both: 'TÄNZER/IN & MODEL' },
    en: { dancer: 'DANCER', model: 'MODEL', both: 'DANCER & MODEL' },
}

const LABELS = {
    de: {
        stats: 'Maße',
        skills: 'Skills',
        languages: 'Sprachen',
        experience: 'Erfahrung',
        booking: 'Booking',
        height: 'Größe',
        bust: 'Brust',
        waist: 'Taille',
        hips: 'Hüfte',
        dressSize: 'Konf.',
        shoeSize: 'Schuhe',
        hair: 'Haare',
        eyes: 'Augen',
    },
    en: {
        stats: 'Stats',
        skills: 'Skills',
        languages: 'Languages',
        experience: 'Experience',
        booking: 'Booking',
        height: 'Height',
        bust: 'Bust',
        waist: 'Waist',
        hips: 'Hips',
        dressSize: 'Dress',
        shoeSize: 'Shoes',
        hair: 'Hair',
        eyes: 'Eyes',
    },
} as const

function renderImage(image: SedcardImageSource | null | undefined, style: Styles[string]) {
    if (!image) return null
    return <Image src={image} style={style} />
}

export function ClassicTemplate({ data }: { data: SedcardData }) {
    const locale = data.locale || 'de'
    const t = LABELS[locale] || LABELS.de
    const categoryLabel =
        (CATEGORY_MAP[locale] || CATEGORY_MAP.de)[data.category] || data.category

    const gallery = data.galleryImages || []
    const skills = data.skills.slice(0, 8)
    const languages = data.languages.slice(0, 5)
    const experienceItems = data.experience.slice(0, 4)

    const measurements = [
        { label: t.height, value: data.measurements?.height },
        { label: t.bust, value: data.measurements?.bust },
        { label: t.waist, value: data.measurements?.waist },
        { label: t.hips, value: data.measurements?.hips },
        { label: t.dressSize, value: data.measurements?.confectionSize },
        { label: t.shoeSize, value: data.measurements?.shoeSize },
        { label: t.hair, value: data.measurements?.hair },
        { label: t.eyes, value: data.measurements?.eyes },
    ].filter((m) => m.value)

    const agencyName = data.agencyInfo?.name || 'DELEYNA'
    const contactLines = [
        data.bookingEmail || data.agencyInfo?.email,
        data.agencyInfo?.phone,
        data.agencyInfo?.website?.replace(/^https?:\/\//, ''),
    ].filter(Boolean)

    const hasSkillsOrLangs = skills.length > 0 || languages.length > 0

    return (
        <Document title={`Sedcard – ${data.name}`} author={agencyName}>
            <Page size="A4" orientation="landscape" style={s.page}>
                {/* ═══ IMAGE GRID: hero left + asymmetric right ═══ */}
                <View style={s.imageArea}>
                    {/* Hero image — 55% width, full height */}
                    <View style={s.heroCol}>
                        {data.featuredImage ? (
                            <Image src={data.featuredImage} style={s.heroImage} />
                        ) : (
                            <View style={s.heroPlaceholder}>
                                <Text style={s.heroPlaceholderText}>SEDCARD</Text>
                            </View>
                        )}

                        {/* Name overlay on hero with dark gradient */}
                        <View style={s.nameOverlay}>
                            <View style={s.nameOverlayGradient} />
                            <Text style={s.categoryLabel}>{categoryLabel}</Text>
                            <Text style={s.talentName}>{data.name}</Text>
                        </View>
                    </View>

                    {/* Side column — 45%, split into grid */}
                    <View style={s.sideCol}>
                        {/* Top: one large image */}
                        <View style={s.sideImgTop}>
                            {gallery[0] ? (
                                renderImage(gallery[0], s.gridImage)
                            ) : (
                                <View style={s.gridPlaceholder} />
                            )}
                        </View>

                        {/* Bottom: two square images side by side */}
                        <View style={s.sideImgBottom}>
                            <View style={s.sideImgBottomLeft}>
                                {gallery[1] ? (
                                    renderImage(gallery[1], s.gridImage)
                                ) : (
                                    <View style={s.gridPlaceholder} />
                                )}
                            </View>
                            <View style={s.sideImgBottomRight}>
                                {gallery[2] ? (
                                    renderImage(gallery[2], s.gridImage)
                                ) : gallery[3] ? (
                                    renderImage(gallery[3], s.gridImage)
                                ) : (
                                    <View style={s.gridPlaceholder} />
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* ═══ COPPER ACCENT LINE ═══ */}
                <View style={s.copperLine} />

                {/* ═══ BOTTOM STATS BAR ═══ */}
                <View style={s.statsBar}>
                    {/* Left: Measurements */}
                    <View style={s.statsLeft}>
                        <Text style={s.sectionLabel}>{t.stats}</Text>
                        <View style={s.measurementsGrid}>
                            {measurements.map((m) => (
                                <View key={m.label} style={s.measurementItem}>
                                    <Text style={s.measurementLabel}>{m.label}</Text>
                                    <Text style={s.measurementValue}>{m.value}</Text>
                                </View>
                            ))}
                        </View>
                        {/* Experience inline */}
                        {experienceItems.length > 0 && (
                            <Text style={s.expLine}>
                                {experienceItems.map((e) => e.title).join(' · ')}
                            </Text>
                        )}
                    </View>

                    {/* Center: Skills + Languages */}
                    {hasSkillsOrLangs && (
                        <View style={s.statsCenter}>
                            {skills.length > 0 && (
                                <View style={{ marginBottom: 6 }}>
                                    <Text style={s.sectionLabel}>{t.skills}</Text>
                                    <View style={s.tagRow}>
                                        {skills.map((skill) => (
                                            <Text key={skill} style={s.tag}>
                                                {skill}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            )}
                            {languages.length > 0 && (
                                <View>
                                    <Text style={s.sectionLabel}>{t.languages}</Text>
                                    <View style={s.tagRow}>
                                        {languages.map((lang) => (
                                            <Text key={lang} style={s.tagAccent}>
                                                {lang}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Right: Agency */}
                    <View style={s.statsRight}>
                        <View style={s.agencyBlock}>
                            {data.agencyLogo && (
                                <Image src={data.agencyLogo} style={s.agencyLogo} />
                            )}
                            <Text style={s.agencyName}>{agencyName}</Text>
                        </View>
                        <View>
                            <Text style={s.bookingLabel}>{t.booking}</Text>
                            {contactLines.map((line, i) => (
                                <Text key={i} style={s.agencyContact}>
                                    {line}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
