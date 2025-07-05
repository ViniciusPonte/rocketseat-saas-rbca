'use client'

import { FormCheckbox } from '@/components/base/form-checkbox'
import { FormInput } from '@/components/base/form-input'
import { Button } from '@/components/ui/button'
import { useFormState } from '@/hooks/use-form-state'
import { createOrganizationAction } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function OrganizationForm() {
  const [formState, handleSubmit, isPending] = useFormState(
    createOrganizationAction
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

      {success && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <FormInput
        name="name"
        label="Organization name"
        error={errors?.name && errors?.name[0]}
      />
      <FormInput
        name="domain"
        label="E-mail domain"
        inputMode="url"
        placeholder="example.com"
        error={errors?.domain && errors?.domain[0]}
      />

      <FormCheckbox
        name="shouldAttachUsersByDomain"
        label="Auto-join new members"
        description="This will automatically invite all members with same e-mail domain
              to this organization"
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 /> : 'Save organization'}
      </Button>
    </form>
  )
}
