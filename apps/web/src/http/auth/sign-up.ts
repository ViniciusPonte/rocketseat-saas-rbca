import { api } from '../api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = void

export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
  const { name, email, password } = request
  await api.post('users', {
    json: {
      name,
      email,
      password,
    },
  })
}
