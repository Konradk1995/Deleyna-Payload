/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { SedcardData, SedcardImageSource } from '../types'

const COPPER = '#C4956A'
const DARK = '#101214'
const MUTED = '#6F7680'
const BORDER = '#E5E7EB'
const PANEL = '#F8F8F8'
const WHITE = '#FFFFFF'

const s = StyleSheet.create({
    page: {
        paddingTop: 28,
        paddingRight: 28,
        paddingBottom: 24,
        paddingLeft: 28,
        backgroundColor: WHITE,
        fontFamily: 'Helvetica',
        color: DARK,
    },
    accentLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: COPPER,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerKicker: {
        fontSize: 8,
        color: COPPER,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 6,
    },
    name: {
        fontSize: 30,
        lineHeight: 1.05,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
    },
    category: {
        fontSize: 10,
        color: MUTED,
    },
    logoBox: {
        alignItems: 'flex-end',
        minWidth: 90,
    },
    logo: {
        width: 64,
        height: 64,
        objectFit: 'contain',
    },
    agencyNameSmall: {
        marginTop: 5,
        fontSize: 8.5,
        color: MUTED,
        textAlign: 'right',
    },
    mediaGrid: {
        marginTop: 18,
        flexDirection: 'row',
    },
    heroCell: {
        flex: 6,
        marginRight: 10,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        overflow: 'hidden',
        height: 330,
        backgroundColor: PANEL,
    },
    sideGrid: {
        flex: 4,
    },
    sideRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    sideRowLast: {
        flexDirection: 'row',
    },
    sideCellLeft: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        overflow: 'hidden',
        height: 160,
        backgroundColor: PANEL,
    },
    sideCellRight: {
        flex: 1,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        overflow: 'hidden',
        height: 160,
        backgroundColor: PANEL,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    placeholderText: {
        fontSize: 8,
        color: MUTED,
        textAlign: 'center',
    },
    infoGrid: {
        marginTop: 16,
        flexDirection: 'row',
    },
    leftCol: {
        flex: 5,
        marginRight: 18,
    },
    rightCol: {
        flex: 5,
    },
    sectionTitle: {
        fontSize: 8,
        color: DARK,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 8,
    },
    measurementsPanel: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        backgroundColor: WHITE,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 2,
        paddingLeft: 10,
    },
    measurementRow: {
        width: '50%',
        marginBottom: 8,
        paddingRight: 8,
    },
    measurementWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    measurementLabel: {
        fontSize: 7,
        color: MUTED,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    measurementValue: {
        fontSize: 10.5,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
    },
    subSection: {
        marginTop: 12,
    },
    tagWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 10,
        paddingTop: 3,
        paddingRight: 7,
        paddingBottom: 3,
        paddingLeft: 7,
        fontSize: 8,
        marginRight: 5,
        marginBottom: 5,
        color: DARK,
        backgroundColor: PANEL,
    },
    tagAccent: {
        borderWidth: 1,
        borderColor: '#EBD7C6',
        borderRadius: 10,
        paddingTop: 3,
        paddingRight: 7,
        paddingBottom: 3,
        paddingLeft: 7,
        fontSize: 8,
        marginRight: 5,
        marginBottom: 5,
        color: COPPER,
        backgroundColor: '#FBF5EE',
        fontFamily: 'Helvetica-Bold',
    },
    experiencePanel: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        paddingTop: 8,
        paddingRight: 10,
        paddingBottom: 8,
        paddingLeft: 10,
        minHeight: 128,
    },
    experienceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        paddingTop: 5,
        paddingBottom: 5,
    },
    experienceRowLast: {
        borderBottomWidth: 0,
    },
    expTitle: {
        flex: 1,
        fontSize: 9,
        color: DARK,
        paddingRight: 8,
    },
    expYear: {
        fontSize: 8.5,
        color: MUTED,
    },
    bio: {
        marginTop: 12,
        fontSize: 8.7,
        lineHeight: 1.45,
        color: MUTED,
    },
    footer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: BORDER,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerLeft: {
        flex: 1,
        paddingRight: 10,
    },
    footerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    footerAgency: {
        fontSize: 9.5,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        marginBottom: 3,
    },
    footerLine: {
        fontSize: 8,
        color: MUTED,
        lineHeight: 1.35,
        textAlign: 'left',
    },
    footerLabel: {
        fontSize: 7,
        color: COPPER,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
    },
    footerLineRight: {
        fontSize: 8,
        color: MUTED,
        lineHeight: 1.35,
        textAlign: 'right',
    },
})

const CATEGORY: Record<string, Record<string, string>> = {
    de: { dancer: 'Tänzer/in', model: 'Model', both: 'Tänzer/in & Model' },
    en: { dancer: 'Dancer', model: 'Model', both: 'Dancer & Model' },
}

const LABELS = {
    de: {
        sedcard: 'Sedcard',
        measurements: 'Maße',
        experience: 'Erfahrung',
        skills: 'Skills',
        languages: 'Sprachen',
        booking: 'Booking',
        photoMissing: 'Bild fehlt',
        height: 'Größe',
        bust: 'Brust',
        waist: 'Taille',
        hips: 'Hüfte',
        dressSize: 'Konfektion',
        shoeSize: 'Schuhgröße',
        hair: 'Haare',
        eyes: 'Augen',
    },
    en: {
        sedcard: 'Sedcard',
        measurements: 'Measurements',
        experience: 'Experience',
        skills: 'Skills',
        languages: 'Languages',
        booking: 'Booking',
        photoMissing: 'Image missing',
        height: 'Height',
        bust: 'Bust',
        waist: 'Waist',
        hips: 'Hips',
        dressSize: 'Dress size',
        shoeSize: 'Shoe size',
        hair: 'Hair',
        eyes: 'Eyes',
    },
} as const

function renderImageOrPlaceholder(image: SedcardImageSource | null | undefined, label: string) {
    if (!image) {
        return (
            <View style={s.placeholder}>
                <Text style={s.placeholderText}>{label}</Text>
            </View>
        )
    }

    return <Image src={image} style={s.image} />
}

function compactText(input: string | null | undefined, maxLength: number) {
    if (!input) return ''
    const normalized = input.replace(/\s+/g, ' ').trim()
    if (normalized.length <= maxLength) return normalized
    return `${normalized.slice(0, maxLength - 1)}…`
}

export function ClassicTemplate({ data }: { data: SedcardData }) {
    const locale = data.locale || 'de'
    const t = LABELS[locale] || LABELS.de
    const categoryMap = CATEGORY[locale] || CATEGORY.de
    const categoryLabel = categoryMap[data.category] || data.category

    const gallery = data.galleryImages || []
    const experienceItems = data.experience.slice(0, 8)
    const skills = data.skills.slice(0, 14)
    const languages = data.languages.slice(0, 8)

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
    const bookingLine =
        data.bookingEmail || data.agencyInfo?.email || data.socialMedia?.instagram || '-'
    const footerLine =
        data.footerText ||
        data.agencyInfo?.address ||
        data.agencyInfo?.website ||
        data.agencyInfo?.phone ||
        ''
    const bioText = compactText(data.bio, 440)

    return (
        <Document title={`Sedcard ${data.name}`} author={agencyName}>
            <Page size="A4" style={s.page}>
                <View style={s.accentLine} />

                <View style={s.header}>
                    <View>
                        <Text style={s.headerKicker}>{t.sedcard}</Text>
                        <Text style={s.name}>{data.name}</Text>
                        <Text style={s.category}>{categoryLabel}</Text>
                    </View>
                    <View style={s.logoBox}>
                        {data.agencyLogo ? <Image src={data.agencyLogo} style={s.logo} /> : null}
                        <Text style={s.agencyNameSmall}>{agencyName}</Text>
                    </View>
                </View>

                <View style={s.mediaGrid}>
                    <View style={s.heroCell}>
                        {renderImageOrPlaceholder(data.featuredImage, t.photoMissing)}
                    </View>
                    <View style={s.sideGrid}>
                        <View style={s.sideRow}>
                            <View style={s.sideCellLeft}>
                                {renderImageOrPlaceholder(gallery[0], t.photoMissing)}
                            </View>
                            <View style={s.sideCellRight}>
                                {renderImageOrPlaceholder(gallery[1], t.photoMissing)}
                            </View>
                        </View>
                        <View style={s.sideRowLast}>
                            <View style={s.sideCellLeft}>
                                {renderImageOrPlaceholder(gallery[2], t.photoMissing)}
                            </View>
                            <View style={s.sideCellRight}>
                                {renderImageOrPlaceholder(gallery[3], t.photoMissing)}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={s.infoGrid}>
                    <View style={s.leftCol}>
                        <Text style={s.sectionTitle}>{t.measurements}</Text>
                        <View style={s.measurementsPanel}>
                            <View style={s.measurementWrap}>
                                {measurements.map((m) => (
                                    <View key={m.label} style={s.measurementRow}>
                                        <Text style={s.measurementLabel}>{m.label}</Text>
                                        <Text style={s.measurementValue}>{m.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {languages.length > 0 && (
                            <View style={s.subSection}>
                                <Text style={s.sectionTitle}>{t.languages}</Text>
                                <View style={s.tagWrap}>
                                    {languages.map((language) => (
                                        <Text key={language} style={s.tagAccent}>
                                            {language}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={s.rightCol}>
                        <Text style={s.sectionTitle}>{t.experience}</Text>
                        <View style={s.experiencePanel}>
                            {experienceItems.length > 0 ? (
                                experienceItems.map((item, idx) => {
                                    const rowStyle =
                                        idx === experienceItems.length - 1
                                            ? [s.experienceRow, s.experienceRowLast]
                                            : s.experienceRow

                                    return (
                                        <View key={`${item.title}-${idx}`} style={rowStyle}>
                                            <Text style={s.expTitle}>{item.title}</Text>
                                            {item.year ? (
                                                <Text style={s.expYear}>{item.year}</Text>
                                            ) : null}
                                        </View>
                                    )
                                })
                            ) : (
                                <Text style={s.expYear}>-</Text>
                            )}
                        </View>

                        {skills.length > 0 && (
                            <View style={s.subSection}>
                                <Text style={s.sectionTitle}>{t.skills}</Text>
                                <View style={s.tagWrap}>
                                    {skills.map((skill) => (
                                        <Text key={skill} style={s.tag}>
                                            {skill}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {bioText ? <Text style={s.bio}>{bioText}</Text> : null}

                <View style={s.footer}>
                    <View style={s.footerLeft}>
                        <Text style={s.footerAgency}>{agencyName}</Text>
                        {footerLine ? <Text style={s.footerLine}>{footerLine}</Text> : null}
                    </View>
                    <View style={s.footerRight}>
                        <Text style={s.footerLabel}>{t.booking}</Text>
                        <Text style={s.footerLineRight}>{bookingLine}</Text>
                        {data.agencyInfo?.website ? (
                            <Text style={s.footerLineRight}>
                                {data.agencyInfo.website.replace(/^https?:\/\//, '')}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </Page>
        </Document>
    )
}
