import { api } from '../api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string
}

type CreateProjectResponse = void

export async function createProject(
  request: CreateProjectRequest
): Promise<CreateProjectResponse> {
  const { name, description, org } = request
  await api.post(`organizations/${org}/projects`, {
    json: {
      name,
      description,
    },
  })
}
