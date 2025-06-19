import { z } from 'zod'
import { roleSchema } from '../roles'

export const userSchema = z.object({
  id: z.string(),
  role: roleSchema,
})

export type IUser = z.infer<typeof userSchema>
