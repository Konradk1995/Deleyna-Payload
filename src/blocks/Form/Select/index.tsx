import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
    Select as SelectComponent,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { cn } from '@/utilities/ui'
import { Error } from '../Error'
import {
    requiredFieldMessage,
    requiredScreenReaderText,
    resolveFormLocale,
} from '../fieldI18n'
import { localizeOptionLabel } from '../localizeOptionLabel'
import { Width } from '../Width'

export const Select: React.FC<
    SelectField & {
        control: Control
        errors: Partial<FieldErrorsImpl>
        leadingIcon?: React.ReactNode
        locale?: 'de' | 'en'
    }
> = ({
    name,
    control,
    errors,
    label,
    options,
    required,
    width,
    defaultValue,
    leadingIcon,
    locale = 'de',
}) => {
    const lang = resolveFormLocale(locale)
    const localizedLabel = localizeOptionLabel(label, lang)

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
            <Controller
                control={control}
                defaultValue={defaultValue}
                name={name}
                render={({ field: { onChange, value } }) => {
                    const controlledValue = options.find((t) => t.value === value)
                    const triggerEl = (
                        <SelectComponent
                            onValueChange={(val) => onChange(val)}
                            value={controlledValue?.value}
                        >
                            <SelectTrigger
                                className={cn('w-full', leadingIcon ? 'mt-2 pl-10' : 'mt-2')}
                                id={name}
                            >
                                <SelectValue placeholder={localizedLabel} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map(({ label, value }) => {
                                    return (
                                        <SelectItem key={value} value={value}>
                                            {localizeOptionLabel(label, lang)}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </SelectComponent>
                    )

                    return leadingIcon ? (
                        <div className="relative mt-2">
                            <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted-foreground">
                                {leadingIcon}
                            </span>
                            {triggerEl}
                        </div>
                    ) : (
                        triggerEl
                    )
                }}
                rules={{ required: required ? requiredFieldMessage(lang) : false }}
            />
            {errors[name] && <Error name={name} locale={lang} />}
        </Width>
    )
}
