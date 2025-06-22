import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-errors'
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

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Update an organization',
          security: [{ bearerAuth: [] }],
          body: organizationSchema,
          params: paramsSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const body = request.body as z.infer<typeof organizationSchema>
        const params = request.params as z.infer<typeof paramsSchema>

        const { name, domain, shouldAttachUsersByDomain } = body
        const { slug } = params
        const { membership, organization } =
          await request.getUserMembership(slug)
        const userId = await request.getCurrentUserId()

        const authOrganization = orgSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to update this organization.'
          )
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: { domain, id: { not: organization.id } },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization with same domain already exists.'
            )
          }
        }

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain,
          },
        })

        return reply.status(204).send()
      }
    )
}
