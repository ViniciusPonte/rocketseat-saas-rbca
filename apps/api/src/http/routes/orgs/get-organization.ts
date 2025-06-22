import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-errors'
import { createSlug } from '@/utils/create-slug'

const paramsSchema = z.object({
  slug: z.string(),
})

export async function getOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get an specific organization',
          security: [{ bearerAuth: [] }],
          params: paramsSchema,
          response: {
            200: z.object({
              organization: z.object({
                id: z.string().uuid(),
                slug: z.string(),
                name: z.string(),
                domain: z.string().nullable(),
                shouldAttachUsersByDomain: z.boolean(),
                avatarUrl: z.string().url().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
                ownerId: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params as z.infer<typeof paramsSchema>
        const { organization } = await request.getUserMembership(slug)

        if (!organization) {
          throw new BadRequestError('There is no organization with this slug.')
        }

        return reply.status(200).send({ organization })
      }
    )
}
