import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type CreateOrganizationResponse = void

export async function createOrganization(
  request: CreateOrganizationRequest
): Promise<CreateOrganizationResponse> {
  const { name, domain, shouldAttachUsersByDomain } = request
  await api.post('organizations', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
