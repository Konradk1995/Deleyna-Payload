import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import React from 'react'

import { Error } from '../Error'
import {
    localizeFieldLabel,
    requiredFieldMessage,
    requiredScreenReaderText,
    resolveFormLocale,
} from '../fieldI18n'
import { Width } from '../Width'

export const Checkbox: React.FC<
    CheckboxField & {
        errors: Partial<FieldErrorsImpl>
        register: UseFormRegister<FieldValues>
        locale?: 'de' | 'en'
    }
> = ({ name, defaultValue, errors, label, register, required, width, locale }) => {
    const lang = resolveFormLocale(locale)
    const localizedLabel = localizeFieldLabel(label, lang)
    const props = register(name, {
        required: required ? requiredFieldMessage(lang) : false,
    })
    const { setValue } = useFormContext()

    return (
        <Width width={width}>
            <label
                htmlFor={name}
                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-muted/30 px-5 py-4 transition duration-200 hover:border-copper/30 hover:bg-foreground/5 focus-within:ring-2 focus-within:ring-ring/50"
            >
                <CheckboxUi
                    defaultChecked={defaultValue}
                    id={name}
                    {...props}
                    className="peer h-5 w-5 data-[state=checked]:bg-copper data-[state=checked]:border-copper"
                    onCheckedChange={(checked) => {
                        setValue(props.name, checked)
                    }}
                />
                <span className="select-none text-base font-medium text-foreground transition-colors group-hover:text-foreground">
                    {localizedLabel}
                    {required && (
                        <span className="ml-1 text-destructive">
                            * <span className="sr-only">{requiredScreenReaderText(lang)}</span>
                        </span>
                    )}
                </span>
            </label>
            {errors[name] && <Error name={name} locale={lang} />}
        </Width>
    )
}
