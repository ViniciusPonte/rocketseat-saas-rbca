'use server'

import { acceptInvite } from '@/http/invites/accept-invite'
import { rejectInvite } from '@/http/invites/reject-invite'
import revalidateTagAction from '@/utils/revalidate-tag'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)

  revalidateTagAction('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}
