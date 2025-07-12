import { api } from '../api-client'

interface UpdateOrganizationRequest {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type UpdateOrganizationResponse = void

export async function updateOrganization(
  request: UpdateOrganizationRequest
): Promise<UpdateOrganizationResponse> {
  const { org, name, domain, shouldAttachUsersByDomain } = request
  await api.post(`organizations/${org}/update`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
