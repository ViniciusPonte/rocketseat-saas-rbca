import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-errors'
import { roleSchema } from '@saas/auth'

export const memberSchema = z.object({
  role: roleSchema,
})

const paramsSchema = z.object({
  slug: z.string(),
  memberId: z.string().uuid(),
})

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/members/:memberId/update',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member',
          security: [{ bearerAuth: [] }],
          params: paramsSchema,
          body: memberSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const params = request.params as z.infer<typeof paramsSchema>
        const body = request.body as z.infer<typeof memberSchema>

        const userId = await request.getCurrentUserId()
        const { slug, memberId } = params
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'User')) {
          throw new UnauthorizedError('Your are not allowed to update members.')
        }

        const { role } = body

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
          data: {
            role,
          },
        })

        return reply.status(204).send()
      }
    )
}
