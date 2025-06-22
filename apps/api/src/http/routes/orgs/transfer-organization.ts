import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-errors'
import { organizationSchema as orgSchema } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-errors'
import { getUserPermissions } from '@/utils/get-user-permissions'

export const transferSchema = z.object({
  newOwnerId: z.string(),
})

const paramsSchema = z.object({
  slug: z.string(),
})

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership',
          security: [{ bearerAuth: [] }],
          body: transferSchema,
          params: paramsSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const body = request.body as z.infer<typeof transferSchema>
        const params = request.params as z.infer<typeof paramsSchema>

        const { newOwnerId } = body
        const { slug } = params

        const { membership, organization } =
          await request.getUserMembership(slug)
        const userId = await request.getCurrentUserId()

        const authOrganization = orgSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to transfer this organization ownership.'
          )
        }

        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: newOwnerId,
            },
          },
        })

        if (!transferToMembership) {
          throw new BadRequestError(
            'Target user is not a member of this organization.'
          )
        }

        // se algumas das atualizacoes falhar na transaction, td volta ao q era
        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId: newOwnerId,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),

          prisma.organization.update({
            where: { id: organization.id },
            data: { ownerId: newOwnerId },
          }),
        ])

        return reply.status(204).send()
      }
    )
}
