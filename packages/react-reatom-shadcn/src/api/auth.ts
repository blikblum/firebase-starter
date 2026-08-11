import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.')

export const signInInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
})

export const signUpInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export type SignInInput = z.output<typeof signInInputSchema>
export type SignUpInput = z.output<typeof signUpInputSchema>
