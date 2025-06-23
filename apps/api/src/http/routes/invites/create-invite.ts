import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-errors'
import { createSlug } from '@/utils/create-slug'
import { roleSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-errors'

export const bodySchema = z.object({
  email: z.string().email(),
  role: roleSchema,
})

const paramsSchema = z.object({
  slug: z.string(),
})

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: paramsSchema,
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const body = request.body as z.infer<typeof bodySchema>
        const params = request.params as z.infer<typeof paramsSchema>

        const userId = await request.getCurrentUserId()
        const { slug } = params
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            'Your are not allowed to create new invites'
          )
        }

        const { email, role } = body
        const [, domain] = email.split('@')

        if (
          organization.shouldAttachUsersByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `Users with "${domain}" domain will join your organization automatically on login`
          )
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            `Another invite with same email already exists.`
          )
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            `Another member with this email already belongs to your organization.`
          )
        }

        const invite = await prisma.invite.create({
          data: {
            organizationId: organization.id,
            authorId: userId,
            email,
            role,
          },
        })

        return reply.status(201).send({
          inviteId: invite.id,
        })
      }
    )
}
