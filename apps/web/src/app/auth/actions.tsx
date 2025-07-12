'use server'

import { signInWithPassword } from '@/http/auth/sign-in-with-password'
import { signUp } from '@/http/auth/sign-up'
import { acceptInvite } from '@/http/invites/accept-invite'
import { env } from '@saas/env'
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

    const inviteId = cookieStore.get('inviteId')?.value

    if (inviteId) {
      try {
        await acceptInvite(inviteId)
        cookieStore.delete('inviteId')
      } catch {}
    }
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

  githubSignInURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSignInURL.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_CLIENT_REDIRECT_URI
  )
  githubSignInURL.searchParams.set('scope', 'user')

  redirect(githubSignInURL.toString())
}

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please enter your full name',
    }),
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail address' }),
    password: z
      .string()
      .min(6, { message: 'The password should have at least 6 characters' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match.',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const validData = signUpSchema.safeParse(Object.fromEntries(data))

  if (!validData.success) {
    const errors = validData.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, email, password } = validData.data

  try {
    await signUp({
      name,
      email,
      password,
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

  redirect('/auth/sign-in')
}
