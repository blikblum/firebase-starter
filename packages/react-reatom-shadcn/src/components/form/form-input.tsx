import * as React from 'react'
import {
  useFormContext,
  useFormState,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export type FormInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<React.ComponentProps<typeof Input>, 'defaultValue' | 'name'> & {
  name: TName
  label: React.ReactNode
  description?: React.ReactNode
  registerOptions?: RegisterOptions<TFieldValues, TName>
}

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  registerOptions,
  id = name,
  ...inputProps
}: FormInputProps<TFieldValues, TName>): React.JSX.Element {
  const { control, getFieldState, register } = useFormContext<TFieldValues>()
  const formState = useFormState({ control, name })
  const fieldState = getFieldState(name, formState)

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        {...inputProps}
        {...register(name, registerOptions)}
        id={id}
        aria-invalid={fieldState.invalid}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
    </Field>
  )
}
