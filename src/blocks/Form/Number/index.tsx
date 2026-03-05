import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import {
  localizeFieldLabel,
  requiredFieldMessage,
  requiredScreenReaderText,
  resolveFormLocale,
} from '../fieldI18n'
import { Width } from '../Width'
export const Number: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    locale?: 'de' | 'en'
  }
> = ({ name, defaultValue, errors, label, register, required, width, locale }) => {
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
      <Input
        className="mt-2"
        defaultValue={defaultValue}
        id={name}
        type="number"
        {...register(name, { required: required ? requiredFieldMessage(lang) : false })}
      />
      {errors[name] && <Error name={name} locale={lang} />}
    </Width>
  )
}
