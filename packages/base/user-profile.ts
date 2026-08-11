import { z } from 'zod'

export const userProfileInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(100, 'Name must be 100 characters or fewer.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
})

export const userProfileSchema = userProfileInputSchema.extend({
  id: z.string().min(1, 'Profile ID is required.'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type UserProfileInput = z.output<typeof userProfileInputSchema>
export type UserProfile = z.output<typeof userProfileSchema>
