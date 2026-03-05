import type { StateField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import {
  localizeFieldLabel,
  requiredFieldMessage,
  requiredScreenReaderText,
  resolveFormLocale,
} from '../fieldI18n'
import { Width } from '../Width'
import { stateOptions } from './options'

export const State: React.FC<
  StateField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    locale?: 'de' | 'en'
  }
> = ({ name, control, errors, label, required, width, locale }) => {
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
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = stateOptions.find((t) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className="mt-2 w-full" id={name}>
                <SelectValue placeholder={localizedLabel} />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
        rules={{ required: required ? requiredFieldMessage(lang) : false }}
      />
      {errors[name] && <Error name={name} locale={lang} />}
    </Width>
  )
}
