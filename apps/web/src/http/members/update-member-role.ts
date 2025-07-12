import { cookies } from 'next/headers'
import { api } from '../api-client'
import type { Role } from '@saas/auth'

interface UpdateMemberRequest {
  org: string
  memberId: string
  role: Role
}

export async function updateMember({
  org,
  memberId,
  role,
}: UpdateMemberRequest) {
  await api.post(`organizations/${org}/members/${memberId}/update`, {
    json: {
      role,
    },
  })
}
