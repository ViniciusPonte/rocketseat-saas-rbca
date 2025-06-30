'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { signInWithGithub, signUpAction } from '../../actions'
import githubIcon from '@/assets/github-icon.svg'
import { FormInput } from '@/components/base/form-input'
import { useFormState } from '@/hooks/use-form-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function SignUpForm() {
  const [formState, handleSubmit, isPending] = useFormState(signUpAction)

  const { errors, message, success } = formState

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <FormInput
        name="name"
        label="Name"
        error={errors?.name && errors?.name[0]}
      />
      <FormInput
        name="email"
        type="email"
        label="E-mail"
        error={errors?.email && errors?.email[0]}
      />
      <FormInput
        name="password"
        type="password"
        label="Password"
        error={errors?.password && errors?.password[0]}
      />
      <FormInput
        name="password_confirmation"
        type="password"
        label="Confirm your password"
        error={
          errors?.password_confirmation && errors?.password_confirmation[0]
        }
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 /> : 'Create account'}
      </Button>

      <Button type="button" variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <Button
        type="button"
        onClick={signInWithGithub}
        variant="outline"
        className="w-full"
      >
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign up with GitHub
      </Button>
    </form>
  )
}
