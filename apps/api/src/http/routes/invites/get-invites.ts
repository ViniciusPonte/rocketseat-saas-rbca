import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-errors'
import { roleSchema } from '@saas/auth'

const paramsSchema = z.object({
  slug: z.string(),
})

export async function getInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get all organization invites',
          security: [{ bearerAuth: [] }],
          params: paramsSchema,
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.string().uuid(),
                  createdAt: z.date(),
                  role: roleSchema,
                  email: z.string().email(),
                  author: z
                    .object({
                      name: z.string().nullable(),
                      id: z.string().uuid(),
                    })
                    .nullable(),
                })
              ),
            }),
          },
        },
      },
      async (request) => {
        const params = request.params as z.infer<typeof paramsSchema>

        const userId = await request.getCurrentUserId()
        const { slug } = params
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Invite')) {
          throw new UnauthorizedError(
            'Your are not allowed to get organization invites'
          )
        }

        const invites = await prisma.invite.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: { select: { id: true, name: true } },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return { invites }
      }
    )
}
