import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { organizationSchema as orgSchema } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-errors'
import { getUserPermissions } from '@/utils/get-user-permissions'

export const organizationSchema = z.object({
  name: z.string(),
  domain: z.string().nullish(),
  shouldAttachUsersByDomain: z.boolean().optional(),
})

const paramsSchema = z.object({
  slug: z.string(),
})

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Shutdown organization',
          security: [{ bearerAuth: [] }],
          params: paramsSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const params = request.params as z.infer<typeof paramsSchema>
        const { slug } = params
        const { membership, organization } =
          await request.getUserMembership(slug)
        const userId = await request.getCurrentUserId()

        const authOrganization = orgSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to shutdown this organization.'
          )
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        })

        return reply.status(204).send()
      }
    )
}
