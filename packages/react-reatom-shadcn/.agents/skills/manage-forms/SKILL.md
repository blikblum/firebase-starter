---
name: manage-forms
description: Create, migrate, or review forms in this repo using React Hook Form, Zod, and shadcn Field components. Use when adding or editing submitted forms, validation schemas, default/reset behavior, form submission states, reusable form wrappers, controlled-versus-uncontrolled field wiring, or form Storybook coverage. Do not apply React Hook Form to standalone search or filter inputs unless the user explicitly requests it.
---

# Manage Forms

Build typed, accessible forms with React Hook Form as the state layer and Zod as the validation and normalization layer. Follow the project rules below when they differ from shadcn's official React Hook Form examples.

## 1) Inspect the existing form boundary

Before editing:

- Find the submitted form, its domain input type/schema, submission service, and adjacent stories.
- Check `src/components/form/` for reusable wrappers before adding new ones.
- Distinguish submitted data from independently controlled UI state. Keep search/filter inputs in their route or store state unless they are part of a submitted form.
- Check whether validation must also protect a service boundary. Put reusable domain schemas in the package that owns the domain type; keep UI-only representation adapters near the form.
- Confirm `react-hook-form`, `@hookform/resolvers`, and `zod` are dependencies of every package that imports them.

## 2) Define schemas and types

- Use Zod for validation and normalization, and pass the schema to `zodResolver`.
- Infer domain types from schema output when the schema owns the domain contract:

```ts
export const itemInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
})

export type ItemInput = z.output<typeof itemInputSchema>
```

- Preserve service-layer validation even when the form uses the same schema. Prefer `safeParse()` when an existing validator returns structured errors instead of throwing.
- Use a form-local schema when the displayed value differs from the domain value, then transform and pipe into the domain schema. Examples include comma-separated text becoming an array and blank numeric inputs becoming `undefined`.
- Keep validation messages specific and attach issues to the corresponding field path.
- Trim text and convert optional blank strings consistently. Do not duplicate normalization in event handlers.

## 3) Initialize the form completely

Use `FormProvider` so shared wrappers can access the form context:

```tsx
const form = useForm<z.input<typeof formSchema>, undefined, z.output<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: '',
    enabled: false,
  },
})

return (
  <FormProvider {...form}>
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>
  </FormProvider>
)
```

- Define every field in `defaultValues`.
- Never initialize a controlled field with `undefined`. Use `''`, `false`, `[]`, or `null` as appropriate.
- Optional uncontrolled number fields may use `undefined`, but adapt the `NaN` produced by an empty input before applying the domain schema.
- When edit data can change after mount, call `reset()` with a complete form-value conversion in an effect.
- Keep the default `onSubmit` validation mode unless product requirements specify another mode. After a failed submit, allow React Hook Form's normal revalidation behavior.
- Set `noValidate` on the form when native browser validation would prevent Zod errors from appearing inline.

## 4) Choose uncontrolled or controlled wiring

Use this decision rule:

- Use `register()` when a component accepts `name`, `ref`, `onChange(event)`, and `onBlur(event)` like a native input.
- Use `Controller` for a one-off composite field.
- Use `useController()` inside a reusable composite wrapper whose API emits values directly.

Use the existing wrappers:

- `FormInput` for `Input`, including text, number, date, URL, password, and file inputs.
- `FormTextarea` for `Textarea`.
- `FormCheckbox` for the shadcn checkbox. Use its fixed `card` variant when the field needs the bordered horizontal treatment.

For numeric native inputs, register the conversion explicitly:

```tsx
<FormInput<FormValues>
  name="age"
  label="Age"
  type="number"
  registerOptions={{ valueAsNumber: true }}
/>
```

Do not use `Controller` for a normal `Input` or `Textarea` unless the displayed value must be actively synchronized or transformed while typing.

When adding another composite wrapper:

- Place it under `src/components/form/` and type `name` with React Hook Form field-path types.
- Call `useController()` inside the wrapper.
- Adapt props explicitly; never spread the React Hook Form `field` object into a composite component.
- Pass `field.name`, `field.ref`, and `field.onBlur` to the focusable component.
- Map custom callbacks precisely, for example:

```tsx
<Checkbox
  name={fieldName}
  checked={value === true}
  onBlur={onBlur}
  onCheckedChange={(checked) => onChange(checked === true)}
/>
```

Prefer fixed visual variants over arbitrary Tailwind class props on shared form wrappers.

## 5) Render accessible feedback

For every validated field:

- Connect `FieldLabel htmlFor` to the control `id`.
- Set `data-invalid={fieldState.invalid}` on `Field`.
- Set `aria-invalid={fieldState.invalid}` on the focusable control.
- Render `FieldError` from the React Hook Form field error.
- Preserve `FieldDescription` when explanatory text exists.

Keep service or authentication failures as form-level errors. Render them with `FieldError` or `role="alert"`; do not overwrite them with client validation messages.

## 6) Submit and reset safely

- Submit only the resolver's validated output.
- Await asynchronous submission callbacks.
- Disable the submit button while either React Hook Form is submitting or the external service reports a busy state.
- Keep the submit button enabled before validation unless product requirements explicitly call for a completeness guard; this lets users trigger accessible inline errors.
- Populate development/demo values through `reset()` or `setValue()`, not local component state.
- Preserve existing navigation, service signatures, and server error behavior unless the request changes them.

## 7) Add Storybook coverage

Create or update an adjacent `*.stories.tsx` file for each form or reusable wrapper:

- Include default and invalid states.
- Cover edit/default-value reset behavior where applicable.
- Cover busy and service-error states.
- Add `play` interactions for invalid submission, normalized valid output, and composite-control changes.
- Use `fn()` from `storybook/test` for callback props and assert the normalized submit payload.

## 8) Verify

After implementation:

- Run `pnpm --filter react-reatom-shadcn check:types` from the repository root.
- Run ESLint on the changed form and story files; run the full lint command when the repository baseline permits it.
- Run `pnpm --filter react-reatom-shadcn build-storybook`.
- Type-check `base` when a shared domain schema or inferred type changes.
- Run the production build when feasible and clearly separate pre-existing failures from regressions introduced by the form change.
- Do not edit generated files such as `src/routeTree.gen.ts`.

Consult <https://ui.shadcn.com/docs/forms/react-hook-form> for unfamiliar shadcn field types, while retaining this skill's controlled-versus-uncontrolled rules when examples diverge.
