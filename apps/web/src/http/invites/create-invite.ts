import type { Role } from '@saas/auth'
import { api } from '../api-client'

interface CreateInviteRequest {
  org: string
  email: string
  role: Role
}

type CreateInviteResponse = void

export async function createInvite(
  request: CreateInviteRequest
): Promise<CreateInviteResponse> {
  const { email, role, org } = request

  await api.post(`organizations/${org}/invites`, {
    json: {
      email,
      role,
    },
  })
}
