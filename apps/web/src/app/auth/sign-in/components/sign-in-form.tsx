'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { signInWithEmailAndPassword } from '../actions'
import githubIcon from '@/assets/github-icon.svg'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { FormInput } from '@/components/base/form-input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormState } from '@/hooks/use-form-state'

export function SignInForm() {
  const [formState, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword
  )

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
      >
        <Link
          href="/auth/forgot-password"
          className="text-foreground text-sm font-medium hover:underline"
        >
          Forgot your password?
        </Link>
      </FormInput>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 /> : 'Sign in with e-mail'}
      </Button>

      <Button type="button" variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign in with GitHub
      </Button>
    </form>
  )
}
