import * as React from 'react'
import {
  useController,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'

const fieldVariantClasses = {
  default: undefined,
  card: 'rounded-md border p-3',
} as const

export type FormCheckboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean> = FieldPathByValue<
    TFieldValues,
    boolean
  >,
> = Omit<
  React.ComponentProps<typeof Checkbox>,
  'checked' | 'defaultChecked' | 'name' | 'onBlur' | 'onCheckedChange'
> & {
  name: TName
  label: React.ReactNode
  description?: React.ReactNode
  variant?: keyof typeof fieldVariantClasses
}

export function FormCheckbox<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean> = FieldPathByValue<
    TFieldValues,
    boolean
  >,
>({
  name,
  label,
  description,
  variant = 'default',
  id = name,
  ...checkboxProps
}: FormCheckboxProps<TFieldValues, TName>): React.JSX.Element {
  const { control } = useFormContext<TFieldValues>()
  const {
    field: { name: fieldName, onBlur, onChange, ref, value },
    fieldState,
  } = useController({ control, name })

  return (
    <Field
      className={fieldVariantClasses[variant]}
      data-invalid={fieldState.invalid}
      orientation="horizontal"
    >
      <Checkbox
        {...checkboxProps}
        ref={ref}
        id={id}
        name={fieldName}
        checked={value === true}
        aria-invalid={fieldState.invalid}
        onBlur={onBlur}
        onCheckedChange={(checked) => onChange(checked === true)}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
      </FieldContent>
    </Field>
  )
}
