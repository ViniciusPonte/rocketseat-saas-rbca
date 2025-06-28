import { api } from './api-client'

interface SignInWithPasswordRequest {
  email: string
  password: string
}
interface SignInWithPasswordResponse {
  token: string
}

export async function signInWithPassword(request: SignInWithPasswordRequest) {
  const { email, password } = request
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
      fetch: globalThis.fetch,
    })
    .json<SignInWithPasswordResponse>()

  return result
}
