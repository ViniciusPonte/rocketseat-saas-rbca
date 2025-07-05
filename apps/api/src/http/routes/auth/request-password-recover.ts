import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-errors'
import { auth } from '@/http/middlewares/auth'

const requestPasswordRecoverSchema = z.object({
  email: z.string().email(),
})

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get the token to reset the password',
        body: requestPasswordRecoverSchema,
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const body = request.body as z.infer<typeof requestPasswordRecoverSchema>

      const { email } = body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        // nós não queremos que as pessoas saibam se o usuário realmente existe!
        return reply.status(201).send()
      }

      const { id } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        },
      })

      return reply.status(201).send()
    }
  )
}
