import { cookies } from 'next/headers'
import { api } from '../api-client'

interface ShutdownOrganizationRequest {
  org: string
}

export async function shutdownOrganization({
  org,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${org}`)
  const cookieStore = await cookies()
  return cookieStore.delete('org')
}
