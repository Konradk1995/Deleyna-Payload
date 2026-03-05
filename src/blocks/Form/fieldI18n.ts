import { localizeOptionLabel } from './localizeOptionLabel'

export type FormLocale = 'de' | 'en'

export function resolveFormLocale(locale?: string): FormLocale {
    return locale === 'en' ? 'en' : 'de'
}

export function localizeFieldLabel(label: unknown, locale: FormLocale): string {
    return localizeOptionLabel(label, locale)
}

export function requiredScreenReaderText(locale: FormLocale): string {
    return locale === 'en' ? '(required)' : '(pflichtfeld)'
}

export function requiredFieldMessage(locale: FormLocale): string {
    return locale === 'en' ? 'This field is required.' : 'Dieses Feld ist erforderlich.'
}

export function invalidEmailMessage(locale: FormLocale): string {
    return locale === 'en'
        ? 'Please enter a valid email address.'
        : 'Bitte gib eine gültige E-Mail-Adresse ein.'
}
