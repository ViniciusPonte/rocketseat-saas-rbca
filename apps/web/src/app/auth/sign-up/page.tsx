import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

import githubIcon from '@/assets/github-icon.svg'
import Image from 'next/image'
import { FormInput } from '@/components/base/form-input'

export default function SignUpPage() {
  return (
    <form action="" className="space-y-4">
      <FormInput name="name" label="Name" />
      <FormInput name="email" type="email" label="E-mail" />
      <FormInput name="password" type="password" label="Password" />
      <FormInput
        name="password_confirmation"
        type="password"
        label="Confirm your password"
      />

      <Button type="submit" className="w-full">
        Create account
      </Button>

      <Button type="button" variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign up with GitHub
      </Button>
    </form>
  )
}
