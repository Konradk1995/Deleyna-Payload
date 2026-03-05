import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import {
    requiredFieldMessage,
    requiredScreenReaderText,
    resolveFormLocale,
} from '../fieldI18n'
import { localizeOptionLabel } from '../localizeOptionLabel'
import { Width } from '../Width'

interface RadioOption {
    label: string
    value: string
}

interface RadioFieldProps {
    name: string
    label?: string
    required?: boolean
    width?: string
    defaultValue?: string
    options?: RadioOption[]
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    locale?: 'de' | 'en'
}

export const Radio: React.FC<RadioFieldProps> = ({
    name,
    defaultValue,
    errors,
    label,
    options,
    register,
    required,
    width,
    locale = 'de',
}) => {
    const lang = resolveFormLocale(locale)
    const localizedLabel = localizeOptionLabel(label, lang)
    return (
        <Width width={width}>
            <Label className="text-foreground">
                {localizedLabel}
                {required && (
                    <span className="text-destructive">
                        * <span className="sr-only">{requiredScreenReaderText(lang)}</span>
                    </span>
                )}
            </Label>
            <div className="mt-3 space-y-3">
                {options?.map((option) => (
                    <label
                        key={option.value}
                        className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-muted/30 px-5 py-4 transition duration-200 hover:border-copper/30 hover:bg-foreground/5 has-[:checked]:border-copper has-[:checked]:bg-copper/5 focus-within:ring-2 focus-within:ring-ring/50"
                    >
                        <input
                            type="radio"
                            value={option.value}
                            defaultChecked={defaultValue === option.value}
                            className="h-5 w-5 accent-copper shadow-sm transition-transform duration-200 group-hover:scale-110"
                            {...register(name, {
                                required: required ? requiredFieldMessage(lang) : false,
                            })}
                        />
                        <span className="select-none text-base font-medium text-foreground transition-colors group-hover:text-foreground">
                            {localizeOptionLabel(option.label, lang)}
                        </span>
                    </label>
                ))}
            </div>
            {errors[name] && <Error name={name} locale={lang} />}
        </Width>
    )
}
