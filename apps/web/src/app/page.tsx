import { auth } from '@/auth/auth'

export default async function Home() {
  const auths = await auth()

  if (auths?.user) {
    return <pre>{JSON.stringify(auths.user, null, 2)}</pre>
  }
}
