export interface SedcardMeasurements {
    height?: string | null
    bust?: string | null
    waist?: string | null
    hips?: string | null
    shoeSize?: string | null
    confectionSize?: string | null
    hair?: string | null
    eyes?: string | null
}

export interface SedcardExperience {
    title: string
    year?: string | null
}

export interface AgencyInfo {
    name?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    website?: string | null
    instagram?: string | null
}

export interface SedcardImageSource {
    data: Buffer
    format: 'jpg' | 'png'
}

export interface SedcardData {
    name: string
    category: 'dancer' | 'model' | 'both'
    locale: 'de' | 'en'
    bio?: string | null
    measurements?: SedcardMeasurements | null
    skills: string[]
    languages: string[]
    experience: SedcardExperience[]
    socialMedia?: {
        instagram?: string | null
        tiktok?: string | null
        website?: string | null
    } | null
    bookingEmail?: string | null
    featuredImage?: SedcardImageSource | null
    agencyLogo?: SedcardImageSource | null
    footerText?: string | null
    agencyInfo?: AgencyInfo | null
    galleryImages?: SedcardImageSource[] | null
}
