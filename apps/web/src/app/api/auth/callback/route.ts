import { signInWithGithub } from '@/http/auth/sign-in-with-github'
import { acceptInvite } from '@/http/invites/accept-invite'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      {
        message: 'Github OAuth code was not found.',
      },
      { status: 400 }
    )
  }

  const { token } = await signInWithGithub({ code })

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

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
