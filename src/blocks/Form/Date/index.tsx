import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'
import React from 'react'

import { Error } from '../Error'
import {
    localizeFieldLabel,
    requiredFieldMessage,
    requiredScreenReaderText,
    resolveFormLocale,
} from '../fieldI18n'
import { Width } from '../Width'

interface DateFieldProps {
    name: string
    label?: string
    required?: boolean
    width?: string
    defaultValue?: string
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    locale?: 'de' | 'en'
}

export const Date: React.FC<DateFieldProps> = ({
    name,
    defaultValue,
    errors,
    label,
    register,
    required,
    width,
    locale,
}) => {
    const lang = resolveFormLocale(locale)
    const localizedLabel = localizeFieldLabel(label, lang)

    return (
        <Width width={width}>
            <Label htmlFor={name} className="text-foreground">
                {localizedLabel}
                {required && (
                    <span className="text-destructive">
                        * <span className="sr-only">{requiredScreenReaderText(lang)}</span>
                    </span>
                )}
            </Label>
            <div className="relative mt-2">
                <Input
                    className="pl-12"
                    defaultValue={defaultValue}
                    id={name}
                    type="date"
                    {...register(name, {
                        required: required ? requiredFieldMessage(lang) : false,
                    })}
                />
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errors[name] && <Error name={name} locale={lang} />}
        </Width>
    )
}
