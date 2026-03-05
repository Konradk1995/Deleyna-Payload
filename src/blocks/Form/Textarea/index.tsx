import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
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

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
    leadingIcon?: React.ReactNode
    locale?: 'de' | 'en'
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required,
  rows = 3,
  width,
  leadingIcon,
  locale,
}) => {
  const lang = resolveFormLocale(locale)
  const localizedLabel = localizeFieldLabel(label, lang)
  const textareaClassName = cn(leadingIcon ? 'mt-2 pl-10' : 'mt-2')
  const textareaEl = (
    <TextAreaComponent
      className={textareaClassName}
      defaultValue={defaultValue}
      id={name}
      rows={rows}
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
          <span className="pointer-events-none absolute left-3 top-3 flex h-5 w-5 items-center justify-center text-muted-foreground">
            {leadingIcon}
          </span>
          {textareaEl}
        </div>
      ) : (
        textareaEl
      )}
      {errors[name] && <Error name={name} locale={lang} />}
    </Width>
  )
}
