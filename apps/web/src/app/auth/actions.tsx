'use server'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address' }),
  password: z
    .string()
    .min(6, { message: 'The password should have at least 6 characters' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const validData = signInSchema.safeParse(Object.fromEntries(data))

  if (!validData.success) {
    const errors = validData.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, password } = validData.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    const cookieStore = await cookies()

    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  redirect('/')
}

export async function signInWithGithub() {
  const githubSignInURL = new URL(`login/oauth/authorize`, 'https://github.com')

  githubSignInURL.searchParams.set('client_id', 'Ov23liwFAPiLoHHxnp6i')
  githubSignInURL.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback'
  )
  githubSignInURL.searchParams.set('scope', 'user')

  redirect(githubSignInURL.toString())
}
