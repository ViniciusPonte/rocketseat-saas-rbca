import { api } from '../api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string | null
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const result = await api
    .get('organizations', {
      next: {
        tags: ['organizations'],
      },
    })
    .json<GetOrganizationsResponse>()

  return result
}
