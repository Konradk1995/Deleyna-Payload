'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { requiredFieldMessage, resolveFormLocale } from '../fieldI18n'

export const Error = ({ name, locale }: { name: string; locale?: 'de' | 'en' }) => {
  const {
    formState: { errors },
  } = useFormContext()
  const lang = resolveFormLocale(locale)
  return (
    <p className="mt-1.5 font-normal-text-regular text-destructive text-sm" role="alert" aria-live="assertive">
      {(errors[name]?.message as string) || requiredFieldMessage(lang)}
    </p>
  )
}
