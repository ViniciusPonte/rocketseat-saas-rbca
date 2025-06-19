import { z } from 'zod'

export const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  ownerId: z.string(),
})

export type IProject = z.infer<typeof projectSchema>
