'use client'

import { FormInput } from '@/components/base/form-input'
import { Button } from '@/components/ui/button'
import { useFormState } from '@/hooks/use-form-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { createProjectAction } from '../actions'

export function ProjectForm() {
  const [formState, handleSubmit, isPending] = useFormState(createProjectAction)

  const { errors, message, success } = formState

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Creation failed!</AlertTitle>
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
        label="Project name"
        error={errors?.name && errors?.name[0]}
      />

      <FormInput
        name="description"
        label="Project description"
        isTextArea
        error={errors?.description && errors?.description[0]}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 /> : 'Save project'}
      </Button>
    </form>
  )
}
