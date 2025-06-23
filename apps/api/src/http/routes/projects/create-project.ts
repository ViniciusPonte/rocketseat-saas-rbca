import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-errors'
import { createSlug } from '@/utils/create-slug'

export const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
})

const paramsSchema = z.object({
  slug: z.string(),
})

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          body: projectSchema,
          params: paramsSchema,
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const body = request.body as z.infer<typeof projectSchema>
        const params = request.params as z.infer<typeof paramsSchema>

        const userId = await request.getCurrentUserId()
        const { slug } = params
        const { organization, membership } =
          await request.getUserMembership(slug)
        const { description, name } = body

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            'Your are not allowed to create new projects'
          )
        }

        const project = await prisma.project.create({
          data: {
            name,
            slug: createSlug(name),
            description,
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({
          projectId: project.id,
        })
      }
    )
}
