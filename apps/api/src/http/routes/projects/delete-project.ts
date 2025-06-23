import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { projectSchema as projSchema } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-errors'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { BadRequestError } from '../_errors/bad-request-errors'

const paramsSchema = z.object({
  orgSlug: z.string(),
  projSlug: z.string(),
})

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/projects/:projSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Delete project',
          security: [{ bearerAuth: [] }],
          params: paramsSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const params = request.params as z.infer<typeof paramsSchema>
        const { orgSlug, projSlug } = params
        const { membership, organization } =
          await request.getUserMembership(orgSlug)
        const userId = await request.getCurrentUserId()

        const project = await prisma.project.findUnique({
          where: { slug: projSlug, organizationId: organization.id },
        })

        if (!project) {
          throw new BadRequestError('Project not found.')
        }

        const authProject = projSchema.parse(project)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to delete this project.'
          )
        }

        await prisma.project.delete({
          where: {
            slug: projSlug,
            organizationId: organization.id,
          },
        })

        return reply.status(204).send()
      }
    )
}
