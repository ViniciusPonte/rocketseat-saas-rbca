import { auth } from '@/http/middlewares/auth'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

const paramsSchema = z.object({
  slug: z.string(),
})

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get user membership on organization',
          security: [{ bearerAuth: [] }],
          params: paramsSchema,
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                userId: z.string().uuid(),
                role: roleSchema,
                organizationId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params as z.infer<typeof paramsSchema>
        const { membership } = await request.getUserMembership(slug)

        return {
          membership: {
            role: roleSchema.parse(membership.role),
            id: membership.id,
            userId: membership.userId,
            organizationId: membership.organizationId,
          },
        }
      }
    )
}
