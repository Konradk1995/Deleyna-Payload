import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/ui'
import React from 'react'

import { Error } from '../Error'
import {
  localizeFieldLabel,
  requiredFieldMessage,
  requiredScreenReaderText,
  resolveFormLocale,
} from '../fieldI18n'
import { Width } from '../Width'

export const Text: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    leadingIcon?: React.ReactNode
    locale?: 'de' | 'en'
  }
> = ({ name, defaultValue, errors, label, register, required, width, leadingIcon, locale }) => {
  const lang = resolveFormLocale(locale)
  const localizedLabel = localizeFieldLabel(label, lang)
  const inputClassName = cn(leadingIcon ? 'mt-2 pl-10' : 'mt-2')
  const inputEl = (
    <Input
      className={inputClassName}
      defaultValue={defaultValue}
      id={name}
      type="text"
      {...register(name, { required: required ? requiredFieldMessage(lang) : false })}
    />
  )
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
      {leadingIcon ? (
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted-foreground">
            {leadingIcon}
          </span>
          {inputEl}
        </div>
      ) : (
        inputEl
      )}
      {errors[name] && <Error name={name} locale={lang} />}
    </Width>
  )
}
