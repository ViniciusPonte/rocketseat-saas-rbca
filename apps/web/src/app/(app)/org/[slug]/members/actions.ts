'use server'

import { getCurrentOrg } from '@/auth/auth'
import { createInvite } from '@/http/invites/create-invite'
import { revokeInvite } from '@/http/invites/revoke-invite'
import { removeMember } from '@/http/members/remove-member'
import { updateMember } from '@/http/members/update-member-role'
import { queryClient } from '@/lib/react-query'
import revalidateTagAction from '@/utils/revalidate-tag'
import { roleSchema, type Role } from '@saas/auth'
import { HTTPError } from 'ky'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid e-mail address.' }),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const validData = inviteSchema.safeParse(Object.fromEntries(data))

  if (!validData.success) {
    const errors = validData.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, role } = validData.data

  const currentOrganization = await getCurrentOrg()

  try {
    await createInvite({
      email,
      role,
      org: currentOrganization!,
    })

    revalidateTagAction(`${currentOrganization}/invites`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  queryClient.invalidateQueries({
    queryKey: [currentOrganization, 'invites'],
  })

  return {
    success: true,
    message: 'Created successfully!',
    errors: null,
  }
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await removeMember({
    org: currentOrg!,
    memberId,
  })

  revalidateTagAction(`${currentOrg}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = await getCurrentOrg()

  await updateMember({
    org: currentOrg!,
    memberId,
    role,
  })

  revalidateTagAction(`${currentOrg}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = await getCurrentOrg()

  await revokeInvite({
    org: currentOrg!,
    inviteId,
  })

  revalidateTagAction(`${currentOrg}/invites`)
}
