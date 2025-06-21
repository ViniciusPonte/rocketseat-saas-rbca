import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

const authWithPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with email and password',
        body: authWithPasswordSchema,
        response: {
          201: z.object({
            token: z.string(),
          }),
          400: z.object({
            massage: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const body = request.body as z.infer<typeof authWithPasswordSchema>

      const { email, password } = body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        return reply.status(400).send({ message: 'Invalid credentials' })
      }

      if (userFromEmail.passwordHash === null) {
        return reply.status(400).send({
          message: 'User does not have a password, use social login instead.',
        })
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash
      )

      if (!isPasswordValid) {
        return reply.status(400).send({ message: 'Invalid credentials' })
      }

      const token = await reply.jwtSign(
        { sub: userFromEmail.id },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      )

      return reply.status(201).send({ token })
    }
  )
}
