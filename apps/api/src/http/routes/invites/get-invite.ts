import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { roleSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-errors'

const paramsSchema = z.object({
  inviteId: z.string().uuid(),
})

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Get invite details',
        params: paramsSchema,
        response: {
          200: z.object({
            invite: z.object({
              organization: z.object({
                name: z.string(),
              }),
              id: z.string().uuid(),
              createdAt: z.date(),
              role: roleSchema,
              email: z.string().email(),
              author: z
                .object({
                  name: z.string().nullable(),
                  id: z.string().uuid(),
                  avatarUrl: z.string().url().nullable(),
                })
                .nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const params = request.params as z.infer<typeof paramsSchema>
      const { inviteId } = params
      //3fa85f64-5717-4562-b3fc-2c963f66afa6

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          organization: {
            select: {
              name: true,
            },
          },
        },
      })

      if (!invite) {
        throw new BadRequestError('Invite not found')
      }

      return { invite }
    }
  )
}
