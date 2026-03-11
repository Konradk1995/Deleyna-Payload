import type { Payload } from 'payload'

/**
 * 5 Form category templates:
 * 1. Kontakt / Allgemein — simple contact form
 * 2. Talent werden — for talents who want to join the agency
 * 3. Talent-Anfrage / Buchung — for clients who want to book talents
 * 4. Job-Anfrage — for companies posting jobs
 * 5. Sonstige Anfrage — generic catch-all
 *
 * All forms are pre-built with the right fields. Admins can customize in CMS.
 * Uses: text, email, textarea, select, radio, number, date, checkbox, country, talentSelection, imageUpload
 */

// Form types
export type FormField = any // simplified for seedering
export type Form = {
    title: string
    formCategory: string
    submitButtonLabel: string
    confirmationType: 'message'
    confirmationMessage: {
        root: {
            type: 'root'
            children: Array<any>
            direction: null | 'ltr' | 'rtl'
            format: string
            indent: number
            version: number
        }
        html?: string
        [k: string]: any
    }
    fields: FormField[]
}

type LocaleCode = 'de' | 'en'

type LocalizedText = Record<LocaleCode, string>

const formMetaByCategory: Record<
    string,
    {
        title: LocalizedText
        submitButtonLabel: LocalizedText
        confirmationText: LocalizedText
    }
> = {
    contact: {
        title: { de: 'Kontakt / Allgemein', en: 'Contact / General' },
        submitButtonLabel: { de: 'Nachricht senden', en: 'Send message' },
        confirmationText: {
            de: 'Vielen Dank für Ihre Nachricht! Wir melden uns schnellstmöglich bei Ihnen.',
            en: "Thank you for your message! We'll get back to you as soon as possible.",
        },
    },
    become_talent: {
        title: { de: 'Talent werden', en: 'Become a talent' },
        submitButtonLabel: { de: 'Bewerbung absenden', en: 'Submit application' },
        confirmationText: {
            de: 'Danke für deine Bewerbung! Unser Team schaut sich dein Profil an und meldet sich innerhalb von 5 Werktagen bei dir.',
            en: 'Thanks for your application! Our team will review your profile and get back to you within 5 business days.',
        },
    },
    talent_booking: {
        title: { de: 'Talent-Anfrage / Buchung', en: 'Talent request / Booking' },
        submitButtonLabel: { de: 'Anfrage senden', en: 'Send request' },
        confirmationText: {
            de: 'Vielen Dank für Ihre Anfrage! Unser Booking-Team wird sich innerhalb von 48 Stunden bei Ihnen melden.',
            en: 'Thank you for your request! Our booking team will get back to you within 48 hours.',
        },
    },
    job_inquiry: {
        title: { de: 'Job-Anfrage', en: 'Job inquiry' },
        submitButtonLabel: { de: 'Job-Anfrage senden', en: 'Send job inquiry' },
        confirmationText: {
            de: 'Vielen Dank für Ihre Stellenanfrage! Wir prüfen Ihr Angebot und melden uns bei Ihnen.',
            en: "Thank you for your job inquiry! We'll review your offer and get back to you.",
        },
    },
    other: {
        title: { de: 'Sonstige Anfrage', en: 'Other inquiry' },
        submitButtonLabel: { de: 'Absenden', en: 'Submit' },
        confirmationText: {
            de: 'Vielen Dank! Wir haben Ihre Anfrage erhalten und melden uns bei Ihnen.',
            en: 'Thank you! We have received your request and will get back to you.',
        },
    },
    class_inquiry: {
        title: { de: 'Class / Kurs-Anfrage', en: 'Class / Course inquiry' },
        submitButtonLabel: { de: 'Platz anfragen', en: 'Request spot' },
        confirmationText: {
            de: 'Danke für deine Anfrage! Wir melden uns schnellstmöglich bei dir mit allen Details zur Class.',
            en: "Thanks for your inquiry! We'll get back to you as soon as possible with all the class details.",
        },
    },
}

const pageBreakTranslations: Record<
    string,
    {
        label?: LocalizedText
        stepTitle?: LocalizedText
    }
> = {
    stepCategory: {
        label: { de: 'Step: Kategorie', en: 'Step: Category' },
        stepTitle: { de: 'Kategorie & Maße', en: 'Category & measurements' },
    },
    stepExperience: {
        label: { de: 'Step: Erfahrung', en: 'Step: Experience' },
        stepTitle: { de: 'Erfahrung & Profil', en: 'Experience & profile' },
    },
    stepMedia: {
        label: { de: 'Step: Bilder', en: 'Step: Images' },
        stepTitle: { de: 'Bilder', en: 'Images' },
    },
    stepConsent: {
        label: { de: 'Step: Bestätigung', en: 'Step: Confirmation' },
        stepTitle: { de: 'Bestätigung', en: 'Confirmation' },
    },
    stepProjectDetails: {
        label: { de: 'Step: Projektdetails', en: 'Step: Project details' },
        stepTitle: { de: 'Projektdetails', en: 'Project details' },
    },
    stepDescription: {
        label: { de: 'Step: Beschreibung', en: 'Step: Description' },
        stepTitle: { de: 'Beschreibung', en: 'Description' },
    },
    stepJobDetails: {
        label: { de: 'Step: Job-Details', en: 'Step: Job details' },
        stepTitle: { de: 'Job-Details', en: 'Job details' },
    },
}

const fieldLabelByName: Record<string, LocalizedText> = {
    firstName: { de: 'Vorname', en: 'First name' },
    lastName: { de: 'Nachname', en: 'Last name' },
    email: { de: 'E-Mail', en: 'Email' },
    phone: { de: 'Telefon', en: 'Phone' },
    subject: { de: 'Betreff', en: 'Subject' },
    message: { de: 'Nachricht', en: 'Message' },
    dateOfBirth: { de: 'Geburtsdatum', en: 'Date of birth' },
    nationality: { de: 'Nationalität', en: 'Nationality' },
    category: { de: 'Kategorie', en: 'Category' },
    height: { de: 'Größe in cm', en: 'Height in cm' },
    confectionSize: { de: 'Konfektionsgröße', en: 'Clothing size' },
    shoeSize: { de: 'Schuhgröße', en: 'Shoe size' },
    bust: { de: 'Brust in cm', en: 'Bust in cm' },
    waist: { de: 'Taille in cm', en: 'Waist in cm' },
    hips: { de: 'Hüfte in cm', en: 'Hips in cm' },
    hairColor: { de: 'Haarfarbe', en: 'Hair colour' },
    eyeColor: { de: 'Augenfarbe', en: 'Eye colour' },
    location: { de: 'Ort', en: 'Location' },
    instagram: { de: 'Instagram Handle', en: 'Instagram handle' },
    tiktok: { de: 'TikTok Handle', en: 'TikTok handle' },
    website: { de: 'Website / Portfolio URL', en: 'Website / Portfolio URL' },
    portfolioImages: { de: 'Portfolio-Bilder', en: 'Portfolio images' },
    experience: { de: 'Erfahrung', en: 'Experience' },
    aboutYou: { de: 'Über dich', en: 'About you' },
    consent: {
        de: 'Ich stimme der Verarbeitung meiner Daten zu',
        en: 'I agree to data processing',
    },
    companyName: { de: 'Firma', en: 'Company' },
    contactName: { de: 'Ansprechpartner', en: 'Contact person' },
    projectType: { de: 'Projektart', en: 'Project type' },
    talentCount: { de: 'Anzahl Talente', en: 'Number of talents' },
    projectDate: { de: 'Datum', en: 'Date' },
    budget: { de: 'Budget (ca.)', en: 'Budget (approx.)' },
    duration: { de: 'Dauer', en: 'Duration' },
    talentSelection: { de: 'Ausgewählte Talente', en: 'Selected talents' },
    desiredTalentProfile: {
        de: 'Gewünschtes Talentprofil (Look, Haare, Stil etc.)',
        en: 'Desired talent profile (look, hair, style, etc.)',
    },
    projectDescription: { de: 'Projektbeschreibung', en: 'Project description' },
    specialRequirements: { de: 'Besondere Anforderungen', en: 'Special requirements' },
    jobTitle: { de: 'Position', en: 'Job title' },
    jobType: { de: 'Art', en: 'Type' },
    salary: { de: 'Gehalt', en: 'Salary' },
    startDate: { de: 'Startdatum', en: 'Start date' },
    description: { de: 'Beschreibung', en: 'Description' },
    requirements: { de: 'Anforderungen', en: 'Requirements' },
    name: { de: 'Name', en: 'Name' },
    className: { de: 'Kurs / Class', en: 'Class / Course' },
    classDate: { de: 'Gewünschtes Datum', en: 'Preferred date' },
    participants: { de: 'Anzahl Teilnehmer', en: 'Number of participants' },
    danceLevel: { de: 'Tanzerfahrung', en: 'Dance experience' },
    whatsapp: { de: 'WhatsApp-Nummer', en: 'WhatsApp number' },
    classMessage: { de: 'Nachricht / Fragen', en: 'Message / Questions' },
}

const optionLabelByFieldValue: Record<string, Record<string, LocalizedText>> = {
    category: {
        dancer: { de: 'Dancer', en: 'Dancer' },
        model: { de: 'Model', en: 'Model' },
        both: { de: 'Dancer & Model', en: 'Dancer & Model' },
    },
    hairColor: {
        black: { de: 'Schwarz', en: 'Black' },
        brown: { de: 'Braun', en: 'Brown' },
        blonde: { de: 'Blond', en: 'Blonde' },
        red: { de: 'Rot', en: 'Red' },
        gray: { de: 'Grau', en: 'Gray' },
        other: { de: 'Andere', en: 'Other' },
    },
    eyeColor: {
        brown: { de: 'Braun', en: 'Brown' },
        blue: { de: 'Blau', en: 'Blue' },
        green: { de: 'Grün', en: 'Green' },
        hazel: { de: 'Hazel', en: 'Hazel' },
        gray: { de: 'Grau', en: 'Gray' },
    },
    projectType: {
        photoshoot: { de: 'Fotoshooting', en: 'Photoshoot' },
        video: { de: 'Videoproduktion', en: 'Video production' },
        event: { de: 'Event / Show / Live', en: 'Event / Show / Live' },
        campaign: { de: 'Kampagne', en: 'Campaign' },
        tv_film: { de: 'TV / Film', en: 'TV / Film' },
        social_media: { de: 'Social Media Content', en: 'Social media content' },
        other: { de: 'Sonstiges', en: 'Other' },
    },
    jobType: {
        fulltime: { de: 'Vollzeit', en: 'Full-time' },
        parttime: { de: 'Teilzeit', en: 'Part-time' },
        freelance: { de: 'Freelance', en: 'Freelance' },
        internship: { de: 'Praktikum', en: 'Internship' },
    },
    danceLevel: {
        none: { de: 'Keine Erfahrung', en: 'No experience' },
        beginner: { de: 'Anfänger', en: 'Beginner' },
        intermediate: { de: 'Fortgeschritten', en: 'Intermediate' },
        advanced: { de: 'Profi', en: 'Advanced' },
    },
}

const helpTextByFieldName: Record<string, LocalizedText> = {
    portfolioImages: {
        de: 'Bitte nur scharfe Portrait/Fullbody-Bilder hochladen. JPG, PNG oder WEBP. Automatische Komprimierung aktiv.',
        en: 'Please upload only sharp portrait/full-body images. JPG, PNG or WEBP. Auto-compression is enabled.',
    },
}

function lexicalMessage(text: string): Form['confirmationMessage'] {
    return {
        root: {
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', text }],
                    version: 1,
                },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
        },
    }
}

function splitBilingual(raw: string): { de: string; en: string } | null {
    const parts = raw
        .split(' / ')
        .map((part) => part.trim())
        .filter(Boolean)
    if (parts.length !== 2) return null
    return { de: parts[0], en: parts[1] }
}

function getTextForLocale(raw: string, locale: LocaleCode): string {
    const split = splitBilingual(raw)
    if (split) return split[locale]
    return raw
}

function localizeField(field: FormField, locale: LocaleCode): FormField {
    const nextField: FormField = { ...field }
    const fieldName = typeof field?.name === 'string' ? field.name : ''

    if (field?.blockType === 'pageBreak') {
        const translated = pageBreakTranslations[fieldName]
        if (translated?.stepTitle) nextField.stepTitle = translated.stepTitle[locale]
        else if (typeof field?.stepTitle === 'string')
            nextField.stepTitle = getTextForLocale(field.stepTitle, locale)

        if (translated?.label) nextField.label = translated.label[locale]
        else if (typeof field?.label === 'string')
            nextField.label = getTextForLocale(field.label, locale)
    } else {
        const translatedLabel = fieldLabelByName[fieldName]
        if (translatedLabel) nextField.label = translatedLabel[locale]
        else if (typeof field?.label === 'string')
            nextField.label = getTextForLocale(field.label, locale)

        if (typeof field?.helpText === 'string') {
            const translatedHelp = helpTextByFieldName[fieldName]
            nextField.helpText = translatedHelp
                ? translatedHelp[locale]
                : getTextForLocale(field.helpText, locale)
        }

        if (Array.isArray(field?.options)) {
            nextField.options = field.options.map((option: { label: string; value: string }) => {
                const translated =
                    optionLabelByFieldValue[fieldName]?.[option.value]?.[locale] ||
                    getTextForLocale(option.label, locale)
                return {
                    ...option,
                    label: translated,
                }
            })
        }
    }

    return nextField
}

function localizeForm(form: Form, locale: LocaleCode): Form {
    const formMeta = formMetaByCategory[form.formCategory]

    return {
        ...form,
        title: formMeta?.title?.[locale] || form.title,
        submitButtonLabel:
            formMeta?.submitButtonLabel?.[locale] ||
            getTextForLocale(form.submitButtonLabel, locale),
        confirmationMessage:
            formMeta?.confirmationText?.[locale] != null
                ? lexicalMessage(formMeta.confirmationText[locale] as string)
                : form.confirmationMessage,
        // Keep fields as bilingual "DE / EN" strings — Payload replaces the entire
        // blocks array per locale update, so we can only persist one locale's data.
        // The frontend's localizeFieldLabel() splits bilingual labels at render time.
        fields: form.fields,
    }
}

const forms: Array<Form> = [
    {
        title: 'Kontakt / Allgemein',
        formCategory: 'contact',
        submitButtonLabel: 'Nachricht senden',
        confirmationType: 'message',
        confirmationMessage: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Vielen Dank für Ihre Nachricht! Wir melden uns schnellstmöglich bei Ihnen.',
                            },
                        ],
                        version: 1,
                    },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
            },
        },
        fields: [
            {
                blockType: 'text',
                name: 'firstName',
                label: 'Vorname / First Name',
                required: true,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'lastName',
                label: 'Nachname / Last Name',
                required: true,
                width: 50,
            },
            { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 50 },
            {
                blockType: 'text',
                name: 'phone',
                label: 'Telefon / Phone',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'subject',
                label: 'Betreff / Subject',
                required: true,
                width: 100,
            },
            {
                blockType: 'textarea',
                name: 'message',
                label: 'Nachricht / Message',
                required: true,
                width: 100,
            },
        ],
    },
    {
        title: 'Talent werden',
        formCategory: 'become_talent',
        submitButtonLabel: 'Bewerbung absenden',
        confirmationType: 'message',
        confirmationMessage: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Danke für deine Bewerbung! Unser Team schaut sich dein Profil an und meldet sich innerhalb von 5 Werktagen bei dir.',
                            },
                        ],
                        version: 1,
                    },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
            },
        },
        fields: [
            // Personal info
            {
                blockType: 'text',
                name: 'firstName',
                label: 'Vorname / First Name',
                required: true,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'lastName',
                label: 'Nachname / Last Name',
                required: true,
                width: 50,
            },
            { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 50 },
            {
                blockType: 'text',
                name: 'phone',
                label: 'Telefon / Phone',
                required: false,
                width: 50,
            },
            {
                blockType: 'date',
                name: 'dateOfBirth',
                label: 'Geburtsdatum / Date of birth',
                required: true,
                width: 50,
            },
            {
                blockType: 'country',
                name: 'nationality',
                label: 'Nationalität / Nationality',
                required: false,
                width: 50,
            },
            // Category
            {
                blockType: 'pageBreak',
                name: 'stepCategory',
                stepTitle: 'Kategorie & Maße',
                label: 'Step: Kategorie',
            },
            {
                blockType: 'radio',
                name: 'category',
                label: 'Kategorie / Category',
                required: true,
                width: 100,
                options: [
                    { label: 'Dancer', value: 'dancer' },
                    { label: 'Model', value: 'model' },
                    { label: 'Dancer & Model', value: 'both' },
                ],
            },
            // Physical attributes
            {
                blockType: 'number',
                name: 'height',
                label: 'Größe in cm / Height in cm',
                required: true,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'confectionSize',
                label: 'Konfektionsgröße / Clothing size',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'shoeSize',
                label: 'Schuhgröße / Shoe size',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'bust',
                label: 'Brust in cm / Bust in cm',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'waist',
                label: 'Taille in cm / Waist in cm',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'hips',
                label: 'Hüfte in cm / Hips in cm',
                required: false,
                width: 50,
            },
            {
                blockType: 'select',
                name: 'hairColor',
                label: 'Haarfarbe / Hair colour',
                required: false,
                width: 50,
                options: [
                    { label: 'Schwarz / Black', value: 'black' },
                    { label: 'Braun / Brown', value: 'brown' },
                    { label: 'Blond / Blonde', value: 'blonde' },
                    { label: 'Rot / Red', value: 'red' },
                    { label: 'Grau / Gray', value: 'gray' },
                    { label: 'Andere / Other', value: 'other' },
                ],
            },
            {
                blockType: 'select',
                name: 'eyeColor',
                label: 'Augenfarbe / Eye colour',
                required: false,
                width: 50,
                options: [
                    { label: 'Braun / Brown', value: 'brown' },
                    { label: 'Blau / Blue', value: 'blue' },
                    { label: 'Grün / Green', value: 'green' },
                    { label: 'Hazel', value: 'hazel' },
                    { label: 'Grau / Gray', value: 'gray' },
                ],
            },
            // Experience & social
            {
                blockType: 'pageBreak',
                name: 'stepExperience',
                stepTitle: 'Erfahrung & Profil',
                label: 'Step: Erfahrung',
            },
            {
                blockType: 'text',
                name: 'location',
                label: 'Standort / Location',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'instagram',
                label: 'Instagram Handle',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'tiktok',
                label: 'TikTok Handle',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'website',
                label: 'Website / Portfolio URL',
                required: false,
                width: 100,
            },
            {
                blockType: 'pageBreak',
                name: 'stepMedia',
                stepTitle: 'Bilder',
                label: 'Step: Bilder',
            },
            {
                blockType: 'imageUpload',
                name: 'portfolioImages',
                label: 'Portfolio-Bilder / Portfolio images',
                required: true,
                width: 100,
                maxFiles: 6,
                maxFileSizeMB: 8,
                minWidth: 1000,
                minHeight: 1400,
                helpText:
                    'Bitte nur scharfe Portrait/Fullbody-Bilder hochladen. JPG, PNG oder WEBP. Automatische Komprimierung aktiv.',
            },
            {
                blockType: 'textarea',
                name: 'experience',
                label: 'Erfahrung / Experience',
                required: false,
                width: 100,
            },
            {
                blockType: 'textarea',
                name: 'aboutYou',
                label: 'Über dich / About you',
                required: true,
                width: 100,
            },
            // Consent
            {
                blockType: 'pageBreak',
                name: 'stepConsent',
                stepTitle: 'Bestätigung',
                label: 'Step: Bestätigung',
            },
            {
                blockType: 'checkbox',
                name: 'consent',
                label: 'Datenschutz zustimmen / Agree to data processing',
                required: true,
                width: 100,
            },
        ],
    },
    {
        title: 'Talent-Anfrage / Buchung',
        formCategory: 'talent_booking',
        submitButtonLabel: 'Anfrage senden',
        confirmationType: 'message',
        confirmationMessage: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Vielen Dank für Ihre Anfrage! Unser Booking-Team wird sich innerhalb von 48 Stunden bei Ihnen melden.',
                            },
                        ],
                        version: 1,
                    },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
            },
        },
        fields: [
            // Company info
            {
                blockType: 'text',
                name: 'companyName',
                label: 'Firma / Company',
                required: true,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'contactName',
                label: 'Ansprechpartner / Contact person',
                required: true,
                width: 50,
            },
            { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 50 },
            {
                blockType: 'text',
                name: 'phone',
                label: 'Telefon / Phone',
                required: true,
                width: 50,
            },
            // Project details
            {
                blockType: 'pageBreak',
                name: 'stepProjectDetails',
                stepTitle: 'Projektdetails',
                label: 'Step: Projektdetails',
            },
            {
                blockType: 'select',
                name: 'projectType',
                label: 'Projektart / Project type',
                required: true,
                width: 50,
                options: [
                    { label: 'Fotoshooting / Photoshoot', value: 'photoshoot' },
                    { label: 'Videoproduktion / Video', value: 'video' },
                    { label: 'Event & Show', value: 'event' },
                    { label: 'Kampagne / Campaign', value: 'campaign' },
                    { label: 'TV / Film', value: 'tv_film' },
                    { label: 'Social Media Content', value: 'social_media' },
                    { label: 'Sonstiges / Other', value: 'other' },
                ],
            },
            {
                blockType: 'number',
                name: 'talentCount',
                label: 'Anzahl Talente / Number of talents',
                required: false,
                width: 50,
            },
            {
                blockType: 'date',
                name: 'projectDate',
                label: 'Datum / Date',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'location',
                label: 'Ort / Location',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'budget',
                label: 'Budget (ca.)',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'duration',
                label: 'Dauer / Duration',
                required: false,
                width: 50,
            },
            // Talent selection
            {
                blockType: 'talentSelection',
                name: 'talentSelection',
                label: 'Ausgewählte Talente / Selected talents',
                required: false,
                width: 100,
            },
            {
                blockType: 'textarea',
                name: 'desiredTalentProfile',
                label: 'Gewünschtes Talentprofil / Desired talent profile',
                required: false,
                width: 100,
            },
            // Description
            {
                blockType: 'pageBreak',
                name: 'stepDescription',
                stepTitle: 'Beschreibung',
                label: 'Step: Beschreibung',
            },
            {
                blockType: 'textarea',
                name: 'projectDescription',
                label: 'Projektbeschreibung / Project description',
                required: true,
                width: 100,
            },
            {
                blockType: 'textarea',
                name: 'specialRequirements',
                label: 'Besondere Anforderungen / Special requirements',
                required: false,
                width: 100,
            },
            // Consent
            {
                blockType: 'checkbox',
                name: 'consent',
                label: 'Datenschutz zustimmen / Agree to data processing',
                required: true,
                width: 100,
            },
        ],
    },
    {
        title: 'Job-Anfrage',
        formCategory: 'job_inquiry',
        submitButtonLabel: 'Job-Anfrage senden',
        confirmationType: 'message',
        confirmationMessage: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Vielen Dank für Ihre Stellenanfrage! Wir prüfen Ihr Angebot und melden uns bei Ihnen.',
                            },
                        ],
                        version: 1,
                    },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
            },
        },
        fields: [
            {
                blockType: 'text',
                name: 'companyName',
                label: 'Firma / Company',
                required: true,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'contactName',
                label: 'Ansprechpartner / Contact',
                required: true,
                width: 50,
            },
            { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 50 },
            {
                blockType: 'text',
                name: 'phone',
                label: 'Telefon / Phone',
                required: false,
                width: 50,
            },
            {
                blockType: 'pageBreak',
                name: 'stepJobDetails',
                stepTitle: 'Job-Details',
                label: 'Step: Job-Details',
            },
            {
                blockType: 'text',
                name: 'jobTitle',
                label: 'Position / Job Title',
                required: true,
                width: 100,
            },
            {
                blockType: 'select',
                name: 'jobType',
                label: 'Art / Type',
                required: true,
                width: 50,
                options: [
                    { label: 'Vollzeit / Full-time', value: 'fulltime' },
                    { label: 'Teilzeit / Part-time', value: 'parttime' },
                    { label: 'Freelance', value: 'freelance' },
                    { label: 'Praktikum / Internship', value: 'internship' },
                ],
            },
            {
                blockType: 'text',
                name: 'salary',
                label: 'Gehalt / Salary',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'location',
                label: 'Ort / Location',
                required: false,
                width: 50,
            },
            {
                blockType: 'date',
                name: 'startDate',
                label: 'Startdatum / Start date',
                required: false,
                width: 50,
            },
            {
                blockType: 'pageBreak',
                name: 'stepDescription',
                stepTitle: 'Beschreibung & Anforderungen',
                label: 'Step: Beschreibung',
            },
            {
                blockType: 'textarea',
                name: 'description',
                label: 'Beschreibung / Description',
                required: true,
                width: 100,
            },
            {
                blockType: 'textarea',
                name: 'requirements',
                label: 'Anforderungen / Requirements',
                required: false,
                width: 100,
            },
        ],
    },
    {
        title: 'Class / Kurs-Anfrage',
        formCategory: 'class_inquiry',
        submitButtonLabel: 'Platz anfragen',
        confirmationType: 'message',
        confirmationMessage: lexicalMessage(
            'Danke für deine Anfrage! Wir melden uns schnellstmöglich bei dir mit allen Details zur Class.',
        ),
        fields: [
            {
                blockType: 'text',
                name: 'firstName',
                label: 'Vorname / First Name',
                required: true,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'lastName',
                label: 'Nachname / Last Name',
                required: true,
                width: 50,
            },
            { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 50 },
            {
                blockType: 'text',
                name: 'whatsapp',
                label: 'WhatsApp-Nummer / WhatsApp number',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'className',
                label: 'Kurs / Class',
                required: false,
                width: 50,
            },
            {
                blockType: 'date',
                name: 'classDate',
                label: 'Gewünschtes Datum / Preferred date',
                required: false,
                width: 50,
            },
            {
                blockType: 'number',
                name: 'participants',
                label: 'Anzahl Teilnehmer / Number of participants',
                required: false,
                width: 50,
            },
            {
                blockType: 'select',
                name: 'danceLevel',
                label: 'Tanzerfahrung / Dance experience',
                required: false,
                width: 50,
                options: [
                    { label: 'Keine Erfahrung / No experience', value: 'none' },
                    { label: 'Anfänger / Beginner', value: 'beginner' },
                    { label: 'Fortgeschritten / Intermediate', value: 'intermediate' },
                    { label: 'Profi / Advanced', value: 'advanced' },
                ],
            },
            {
                blockType: 'textarea',
                name: 'classMessage',
                label: 'Nachricht oder Fragen / Message or questions',
                required: false,
                width: 100,
            },
            {
                blockType: 'checkbox',
                name: 'consent',
                label: 'Datenschutz zustimmen / Agree to data processing',
                required: true,
                width: 100,
            },
        ],
    },
    {
        title: 'Sonstige Anfrage',
        formCategory: 'other',
        submitButtonLabel: 'Absenden',
        confirmationType: 'message',
        confirmationMessage: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Vielen Dank! Wir haben Ihre Anfrage erhalten und melden uns bei Ihnen.',
                            },
                        ],
                        version: 1,
                    },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
            },
        },
        fields: [
            { blockType: 'text', name: 'name', label: 'Name', required: true, width: 100 },
            { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 50 },
            {
                blockType: 'text',
                name: 'phone',
                label: 'Telefon / Phone',
                required: false,
                width: 50,
            },
            {
                blockType: 'text',
                name: 'subject',
                label: 'Betreff / Subject',
                required: true,
                width: 100,
            },
            {
                blockType: 'textarea',
                name: 'message',
                label: 'Nachricht / Message',
                required: true,
                width: 100,
            },
        ],
    },
]

export async function formsSeeder(payload: Payload) {
    console.log('📦 Seeding form templates...')

    let created = 0
    const skipped = 0

    for (const form of forms) {
        try {
            const deForm = localizeForm(form, 'de')
            const enForm = localizeForm(form, 'en')

            const existing = await payload.find({
                collection: 'forms',
                where: { formCategory: { equals: form.formCategory } },
            })

            // Payload replaces block arrays per-locale update, wiping the other
            // locale's sub-field data. Our localization config: EN falls back to DE
            // (fallbackLocale: 'de'). So we:
            //   1) Set EN first (bilingual labels satisfy required validation)
            //   2) Set DE last — DE labels persist, EN falls back to them
            // The frontend's localizeOptionLabel splits "DE / EN" strings.

            if (existing.docs.length > 0) {
                console.log(`  🔄  Form "${deForm.title}" already exists, updating...`)
                // 1) EN: bilingual labels + EN-specific doc-level fields
                await payload.update({
                    collection: 'forms',
                    id: existing.docs[0].id,
                    locale: 'en',
                    data: {
                        submitButtonLabel: enForm.submitButtonLabel,
                        confirmationType: enForm.confirmationType,
                        confirmationMessage: enForm.confirmationMessage,
                        fields: deForm.fields,
                    } as any,
                    context: { disableRevalidate: true },
                })
                // 2) DE last: bilingual labels + DE doc-level fields (title is NOT localized)
                await payload.update({
                    collection: 'forms',
                    id: existing.docs[0].id,
                    data: {
                        title: deForm.title,
                        formCategory: deForm.formCategory,
                        submitButtonLabel: deForm.submitButtonLabel,
                        confirmationType: deForm.confirmationType,
                        confirmationMessage: deForm.confirmationMessage,
                        fields: deForm.fields,
                    } as any,
                    context: { disableRevalidate: true },
                })
                created++ // Count as "processed" or "updated"
                continue
            }

            // New form: create sets DE (default locale)
            const createdForm = await payload.create({
                collection: 'forms',
                data: {
                    title: deForm.title,
                    formCategory: deForm.formCategory,
                    submitButtonLabel: deForm.submitButtonLabel,
                    confirmationType: deForm.confirmationType,
                    confirmationMessage: deForm.confirmationMessage,
                    fields: deForm.fields,
                } as any,
                context: { disableRevalidate: true },
            })
            // EN: bilingual labels + EN doc-level fields
            await payload.update({
                collection: 'forms',
                id: createdForm.id,
                locale: 'en',
                data: {
                    submitButtonLabel: enForm.submitButtonLabel,
                    confirmationType: enForm.confirmationType,
                    confirmationMessage: enForm.confirmationMessage,
                    fields: deForm.fields,
                } as any,
                context: { disableRevalidate: true },
            })
            // Re-set DE to restore block labels wiped by EN update
            await payload.update({
                collection: 'forms',
                id: createdForm.id,
                data: {
                    fields: deForm.fields,
                } as any,
                context: { disableRevalidate: true },
            })

            console.log(`  ✅ Created form: ${deForm.title} (DE/EN)`)
            created++
        } catch (error) {
            console.error(`  ❌ Error creating form "${form.title}":`, error)
        }
    }

    return { created, skipped, total: forms.length }
}
